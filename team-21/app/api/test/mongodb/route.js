import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserModel } from '@/lib/models/User';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connections...');
    
    const results = {};
    const roles = ['admin', 'user', 'moderator'];
    
    // Test each database connection
    for (const role of roles) {
      try {
        console.log(`Testing ${role} database...`);
        
        const connection = await connectToDatabase(role);
        const User = getUserModel(connection);
        
        // Test basic database operation
        const userCount = await User.countDocuments();
        
        results[role] = {
          status: 'connected',
          userCount,
          database: connection.name,
          readyState: connection.readyState
        };
        
        console.log(`✅ ${role} database connected successfully`);
      } catch (error) {
        console.error(`❌ ${role} database connection failed:`, error.message);
        results[role] = {
          status: 'failed',
          error: error.message
        };
      }
    }
    
    // Overall status
    const allConnected = Object.values(results).every(r => r.status === 'connected');
    
    return NextResponse.json({
      success: allConnected,
      message: allConnected ? 'All databases connected successfully' : 'Some database connections failed',
      connections: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
