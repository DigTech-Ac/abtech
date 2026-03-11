// src/actions/dashboard.actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalPosts = await prisma.post.count();
    const totalOrders = await prisma.order.count();

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true } }
      }
    });

    // Revenus de la boutique (Commandes physiques ou digitales)
    const revenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
    });
    
    // Revenus des formations (Inscriptions payées)
    const enrollmentRevenueResult = await prisma.enrollment.aggregate({
      _sum: { amountPaid: true },
      where: { isPaid: true }
    });

    // NOUVEAU : Séparation des revenus
    const shopRevenue = revenueResult._sum.totalAmount || 0;
    const courseRevenue = enrollmentRevenueResult._sum.amountPaid || 0;
    const totalRevenue = shopRevenue + courseRevenue;

    const months =["Janv", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    const chartData =[];
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        
        const nextMonth = new Date(d);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // CORRECTION : Même filtre pour le graphique mensuel
        const ordersInMonth = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { 
              status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }, 
              createdAt: { gte: d, lt: nextMonth } 
            }
        });

        const enrollmentsInMonth = await prisma.enrollment.aggregate({
            _sum: { amountPaid: true },
            where: { 
              isPaid: true, 
              createdAt: { gte: d, lt: nextMonth } 
            }
        });

        const monthRevenue = (ordersInMonth._sum.totalAmount || 0) + (enrollmentsInMonth._sum.amountPaid || 0);

        chartData.push({
            name: months[d.getMonth()],
            revenue: monthRevenue
        });
    }

    return {
      success: true,
      stats: { 
        users: totalUsers, 
        courses: totalCourses, 
        posts: totalPosts, 
        orders: totalOrders, 
        revenue: totalRevenue,
        shopRevenue,
        courseRevenue
      },
      recentOrders,
      chartData
    };
  } catch (error: any) {
    console.error("Erreur Dashboard:", error);
    return { success: false, error: error.message };
  }
}

export async function getAnalyticsData() {
  try {
    const topCoursesData = await prisma.course.findMany({
      // CORRECTION : On ne compte que les étudiants qui ont payé pour faire le classement
      include: { 
        _count: { 
          select: { enrollments: { where: { isPaid: true } } } 
        } 
      }
    });
    
    const topCourses = topCoursesData
      .sort((a, b) => b._count.enrollments - a._count.enrollments)
      .slice(0, 4)
      .map(c => ({
        course: c.title,
        students: c._count.enrollments,
        revenue: (c.price * c._count.enrollments)
      }));

    const recentInscriptionsData = await prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      }
    });

    const recentInscriptions = recentInscriptionsData.map(e => ({
      name: e.user.name,
      course: e.course.title,
      date: new Date(e.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }),
      amount: e.amountPaid || 0,
      isPaid: e.isPaid
    }));

    return { success: true, topCourses, recentInscriptions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
