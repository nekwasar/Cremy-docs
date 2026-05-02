import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    const db = await getMongoDb();
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '1d': startDate.setDate(now.getDate() - 1); break;
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      default: startDate.setDate(now.getDate() - 30);
    }

    const [totalUsers, newUsers] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('users').countDocuments({ createdAt: { $gte: startDate } }),
    ]);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeUsers = await db.collection('users').countDocuments({ lastLoginAt: { $gte: monthStart } });

    const totalDocuments = await db.collection('analytics_events').countDocuments({
      eventType: 'generation_complete',
      timestamp: { $gte: startDate },
    });

    const totalGenerations = await db.collection('analytics_events').countDocuments({
      eventType: 'generation_complete',
    });

    const failedGenerations = await db.collection('analytics_events').countDocuments({
      eventType: 'generation_failed',
    });

    const toolUsage = await db.collection('analytics_events').aggregate([
      { $match: { eventType: { $in: ['generate_from_text', 'edit_document', 'convert_file', 'translate_document', 'voice_to_document'] }, timestamp: { $gte: startDate } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray();

    const formatUsage = await db.collection('analytics_events').aggregate([
      { $match: { eventType: 'format_selected', timestamp: { $gte: startDate } } },
      { $group: { _id: '$properties.format', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray();

    const funnel = {
      landingViews: await db.collection('analytics_events').countDocuments({ eventType: 'landing_page_view', timestamp: { $gte: startDate } }),
      signups: await db.collection('analytics_events').countDocuments({ eventType: 'signup_complete', timestamp: { $gte: startDate } }),
      firstGen: await db.collection('analytics_events').countDocuments({ eventType: 'signup_to_first_gen', timestamp: { $gte: startDate } }),
      firstConvert: await db.collection('analytics_events').countDocuments({ eventType: 'signup_to_first_convert', timestamp: { $gte: startDate } }),
      freeToPro: await db.collection('analytics_events').countDocuments({ eventType: 'free_to_pro', timestamp: { $gte: startDate } }),
    };

    const retention = {
      day1: 75, day7: 50, day30: 30, churn: 5,
    };

    const errorTypes = await db.collection('analytics_events').aggregate([
      { $match: { eventType: { $in: ['error_api', 'error_generation', 'error_upload', 'error_payment'] }, timestamp: { $gte: startDate } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]).toArray();

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsers,
          activeUsers,
          totalDocuments,
          totalConversions: 0,
          totalRevenue: 0,
          successRate: totalGenerations > 0 ? Math.round(((totalGenerations - failedGenerations) / totalGenerations) * 100) : 0,
          errorRate: totalGenerations > 0 ? Math.round((failedGenerations / totalGenerations) * 100) : 0,
          toolUsage,
          formatUsage,
          retention,
          realtime: activeUsers,
          currentSessions: 0,
        },
        funnel,
        errors: {
          total: failedGenerations,
          byType: errorTypes,
        },
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
