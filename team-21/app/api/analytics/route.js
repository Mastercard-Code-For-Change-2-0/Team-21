import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from "@/lib/models/User";

// GET - Get analytics data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame') || '30'; // days
    const type = searchParams.get('type') || 'overview'; // overview, placement, documents, growth

    await connectDB();
    

    const now = new Date();
    const timeFrameDate = new Date(now.getTime() - (parseInt(timeFrame) * 24 * 60 * 60 * 1000));

    let analyticsData = {};

    switch (type) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(User, timeFrameDate);
        break;
      case 'placement':
        analyticsData = await getPlacementAnalytics(User, timeFrameDate);
        break;
      case 'documents':
        analyticsData = await getDocumentAnalytics(User, timeFrameDate);
        break;
      case 'growth':
        analyticsData = await getGrowthAnalytics(User, timeFrameDate);
        break;
      default:
        analyticsData = await getOverviewAnalytics(User, timeFrameDate);
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    }, { status: 500 });
  }
}

// Helper functions for different analytics types
async function getOverviewAnalytics(User, timeFrameDate) {
  const [userStats, growthTrends, recentActivities] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]),
    User.aggregate([
      {
        $match: { created_at: { $gte: timeFrameDate } }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]),
    User.find({ updated_at: { $gte: timeFrameDate } })
      .select('full_name username role updated_at')
      .sort({ updated_at: -1 })
      .limit(20)
  ]);

  return { userStats, growthTrends, recentActivities };
}

async function getPlacementAnalytics(User, timeFrameDate) {
  const [placementStats, placementTrends, topCompanies] = await Promise.all([
    User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$placement_status',
          count: { $sum: 1 }
        }
      }
    ]),
    User.aggregate([
      {
        $match: {
          role: 'student',
          placement_status: { $in: ['Placed', 'Multiple Offers'] },
          updated_at: { $gte: timeFrameDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updated_at' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]),
    User.aggregate([
      { $unwind: '$professional_growth' },
      {
        $group: {
          _id: '$professional_growth.company_name',
          count: { $sum: 1 },
          avgSalary: { $avg: '$professional_growth.salary' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return { placementStats, placementTrends, topCompanies };
}

async function getDocumentAnalytics(User, timeFrameDate) {
  const [documentStats, verificationTrends, documentTypes] = await Promise.all([
    User.aggregate([
      { $unwind: '$marksheets' },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: {
            $sum: { $cond: ['$marksheets.verified', 1, 0] }
          },
          pending: {
            $sum: { $cond: ['$marksheets.verified', 0, 1] }
          }
        }
      }
    ]),
    User.aggregate([
      { $unwind: '$marksheets' },
      {
        $match: {
          'marksheets.upload_date': { $gte: timeFrameDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$marksheets.upload_date' } },
            verified: '$marksheets.verified'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]),
    User.aggregate([
      { $unwind: '$marksheets' },
      {
        $group: {
          _id: '$marksheets.document_type',
          count: { $sum: 1 },
          verified: {
            $sum: { $cond: ['$marksheets.verified', 1, 0] }
          }
        }
      }
    ])
  ]);

  return { documentStats, verificationTrends, documentTypes };
}

async function getGrowthAnalytics(User, timeFrameDate) {
  const [growthStats, salaryTrends, skillsAnalysis] = await Promise.all([
    User.aggregate([
      { $unwind: '$professional_growth' },
      {
        $group: {
          _id: '$professional_growth.employment_type',
          count: { $sum: 1 },
          avgSalary: { $avg: '$professional_growth.salary' },
          avgRating: { $avg: '$professional_growth.rating' }
        }
      }
    ]),
    User.aggregate([
      { $unwind: '$professional_growth' },
      {
        $match: {
          'professional_growth.start_date': { $gte: timeFrameDate }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$professional_growth.start_date' } }
          },
          avgSalary: { $avg: '$professional_growth.salary' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]),
    User.aggregate([
      { $unwind: '$professional_growth' },
      { $unwind: '$professional_growth.skills_acquired' },
      {
        $group: {
          _id: '$professional_growth.skills_acquired',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ])
  ]);

  return { growthStats, salaryTrends, skillsAnalysis };
}
