import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getModels } from '@/lib/models/User';

// POST - Seed dummy student data
export async function POST(request) {
  try {
    const { clearExisting = false } = await request.json();
    
    const connection = await connectDB();
    const { User } = getModels(connection);

    // Dummy student data
    const dummyStudents = [
      {
        username: "john_doe_2024",
        email: "john.doe@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001234",
        full_name: "John Doe",
        dob: new Date("1998-05-15"),
        gender: "male",
        phone: "9876543210",
        address: "123 Main Street, Mumbai, Maharashtra",
        education_level: "B.Tech Computer Science",
        graduation_year: 2022,
        college_name: "Indian Institute of Technology, Mumbai",
        placement_status: "Placed",
        enrollment_date: new Date("2023-01-15"),
        status: "active",
        professional_growth: [
          {
            company_name: "TechCorp Solutions",
            job_role: "Software Developer",
            employment_type: "Full Time",
            start_date: new Date("2023-07-01"),
            salary: 650000,
            rating: 4,
            skills_acquired: ["React", "Node.js", "MongoDB", "AWS"],
            achievements: ["Employee of the Month", "Led team project"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/john_graduation.pdf",
            file_name: "john_graduation_certificate.pdf",
            upload_date: new Date("2023-02-01"),
            verified: true
          }
        ]
      },
      {
        username: "priya_sharma_2024",
        email: "priya.sharma@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001235",
        full_name: "Priya Sharma",
        dob: new Date("1999-08-22"),
        gender: "female",
        phone: "9876543211",
        address: "456 Park Avenue, Delhi",
        education_level: "B.Tech Information Technology",
        graduation_year: 2023,
        college_name: "Delhi Technological University",
        placement_status: "Multiple Offers",
        enrollment_date: new Date("2023-01-20"),
        status: "active",
        professional_growth: [
          {
            company_name: "DataFlow Analytics",
            job_role: "Data Analyst",
            employment_type: "Full Time",
            start_date: new Date("2023-08-15"),
            salary: 580000,
            rating: 5,
            skills_acquired: ["Python", "SQL", "Tableau", "Machine Learning"],
            achievements: ["Best Analyst Award", "Process Improvement Initiative"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/priya_graduation.pdf",
            file_name: "priya_graduation_certificate.pdf",
            upload_date: new Date("2023-02-05"),
            verified: true
          }
        ]
      },
      {
        username: "rahul_kumar_2024",
        email: "rahul.kumar@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001236",
        full_name: "Rahul Kumar",
        dob: new Date("1997-12-10"),
        gender: "male",
        phone: "9876543212",
        address: "789 Tech Park, Bangalore, Karnataka",
        education_level: "B.E Electronics & Communication",
        graduation_year: 2021,
        college_name: "Bangalore Institute of Technology",
        placement_status: "Not Placed",
        enrollment_date: new Date("2023-02-01"),
        status: "active",
        professional_growth: [
          {
            company_name: "StartupXYZ",
            job_role: "Frontend Developer Intern",
            employment_type: "Internship",
            start_date: new Date("2023-06-01"),
            end_date: new Date("2023-08-31"),
            salary: 25000,
            rating: 3,
            skills_acquired: ["HTML", "CSS", "JavaScript", "React"],
            achievements: ["Completed 3 projects", "Received good feedback"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/rahul_graduation.pdf",
            file_name: "rahul_graduation_certificate.pdf",
            upload_date: new Date("2023-02-10"),
            verified: false
          }
        ]
      },
      {
        username: "sneha_patel_2024",
        email: "sneha.patel@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001237",
        full_name: "Sneha Patel",
        dob: new Date("2000-03-18"),
        gender: "female",
        phone: "9876543213",
        address: "321 University Road, Pune, Maharashtra",
        education_level: "B.Sc Computer Science",
        graduation_year: 2023,
        college_name: "Pune University",
        placement_status: "Placed",
        enrollment_date: new Date("2023-02-15"),
        status: "active",
        professional_growth: [
          {
            company_name: "CloudTech Services",
            job_role: "Cloud Engineer",
            employment_type: "Full Time",
            start_date: new Date("2023-09-01"),
            salary: 720000,
            rating: 4,
            skills_acquired: ["AWS", "Docker", "Kubernetes", "DevOps"],
            achievements: ["AWS Certification", "Team Lead for migration project"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/sneha_graduation.pdf",
            file_name: "sneha_graduation_certificate.pdf",
            upload_date: new Date("2023-02-20"),
            verified: true
          }
        ]
      },
      {
        username: "arjun_singh_2024",
        email: "arjun.singh@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001238",
        full_name: "Arjun Singh",
        dob: new Date("1998-11-25"),
        gender: "male",
        phone: "9876543214",
        address: "654 Innovation Hub, Hyderabad, Telangana",
        education_level: "B.Tech Mechanical Engineering",
        graduation_year: 2022,
        college_name: "BITS Pilani",
        placement_status: "Not Placed",
        enrollment_date: new Date("2023-03-01"),
        status: "active",
        professional_growth: [],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/arjun_graduation.pdf",
            file_name: "arjun_graduation_certificate.pdf",
            upload_date: new Date("2023-03-05"),
            verified: false
          }
        ]
      },
      {
        username: "kavya_reddy_2024",
        email: "kavya.reddy@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001239",
        full_name: "Kavya Reddy",
        dob: new Date("1999-07-08"),
        gender: "female",
        phone: "9876543215",
        address: "987 Software City, Chennai, Tamil Nadu",
        education_level: "B.E Computer Science",
        graduation_year: 2023,
        college_name: "Anna University",
        placement_status: "Placed",
        enrollment_date: new Date("2023-03-10"),
        status: "active",
        professional_growth: [
          {
            company_name: "MobileFirst Solutions",
            job_role: "Mobile App Developer",
            employment_type: "Full Time",
            start_date: new Date("2023-10-01"),
            salary: 600000,
            rating: 4,
            skills_acquired: ["Flutter", "React Native", "iOS", "Android"],
            achievements: ["Published 2 apps", "5-star app rating"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/kavya_graduation.pdf",
            file_name: "kavya_graduation_certificate.pdf",
            upload_date: new Date("2023-03-15"),
            verified: true
          }
        ]
      },
      {
        username: "amit_gupta_2024",
        email: "amit.gupta@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001240",
        full_name: "Amit Gupta",
        dob: new Date("1998-01-30"),
        gender: "male",
        phone: "9876543216",
        address: "147 Business District, Gurgaon, Haryana",
        education_level: "MBA Finance",
        graduation_year: 2023,
        college_name: "Indian Institute of Management, Gurgaon",
        placement_status: "Multiple Offers",
        enrollment_date: new Date("2023-03-20"),
        status: "active",
        professional_growth: [
          {
            company_name: "FinTech Innovations",
            job_role: "Business Analyst",
            employment_type: "Full Time",
            start_date: new Date("2023-08-01"),
            salary: 850000,
            rating: 5,
            skills_acquired: ["Financial Modeling", "Data Analysis", "Project Management"],
            achievements: ["Increased efficiency by 30%", "Led cross-functional team"]
          }
        ],
        marksheets: [
          {
            document_type: "Post-Graduation",
            file_url: "https://example.com/docs/amit_mba.pdf",
            file_name: "amit_mba_certificate.pdf",
            upload_date: new Date("2023-03-25"),
            verified: true
          }
        ]
      },
      {
        username: "ritu_jain_2024",
        email: "ritu.jain@gmail.com",
        password_hash: "$2b$10$dummyhash1234567890abcdef",
        role: "student",
        student_code: "Y4D_K_001241",
        full_name: "Ritu Jain",
        dob: new Date("2000-09-12"),
        gender: "female",
        phone: "9876543217",
        address: "258 Green Valley, Jaipur, Rajasthan",
        education_level: "B.Tech Electrical Engineering",
        graduation_year: 2024,
        college_name: "Rajasthan Technical University",
        placement_status: "Not Placed",
        enrollment_date: new Date("2024-01-15"),
        status: "active",
        professional_growth: [
          {
            company_name: "PowerGrid Solutions",
            job_role: "Electrical Engineering Trainee",
            employment_type: "Internship",
            start_date: new Date("2024-02-01"),
            end_date: new Date("2024-04-30"),
            salary: 20000,
            rating: 3,
            skills_acquired: ["AutoCAD", "MATLAB", "Power Systems"],
            achievements: ["Completed training program", "Good project presentation"]
          }
        ],
        marksheets: [
          {
            document_type: "Graduation",
            file_url: "https://example.com/docs/ritu_graduation.pdf",
            file_name: "ritu_graduation_certificate.pdf",
            upload_date: new Date("2024-01-20"),
            verified: false
          }
        ]
      }
    ];

    // Clear existing data if requested
    if (clearExisting) {
      await User.deleteMany({ role: 'student' });
    }

    // Check for existing users to avoid duplicates
    const existingEmails = await User.find({ 
      email: { $in: dummyStudents.map(s => s.email) }
    }).select('email');
    
    const existingEmailSet = new Set(existingEmails.map(u => u.email));
    const newStudents = dummyStudents.filter(s => !existingEmailSet.has(s.email));

    if (newStudents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All dummy students already exist in database',
        data: {
          inserted: 0,
          existing: dummyStudents.length
        }
      });
    }

    // Insert new students
    const insertedStudents = await User.insertMany(newStudents);

    // Calculate statistics
    const stats = {
      total: insertedStudents.length,
      placed: insertedStudents.filter(s => s.placement_status === 'Placed').length,
      multipleOffers: insertedStudents.filter(s => s.placement_status === 'Multiple Offers').length,
      notPlaced: insertedStudents.filter(s => s.placement_status === 'Not Placed').length,
      withExperience: insertedStudents.filter(s => s.professional_growth.length > 0).length,
      documentsUploaded: insertedStudents.reduce((acc, s) => acc + s.marksheets.length, 0)
    };

    return NextResponse.json({
      success: true,
      message: `Successfully added ${insertedStudents.length} dummy students`,
      data: {
        inserted: insertedStudents.length,
        skipped: dummyStudents.length - newStudents.length,
        statistics: stats,
        sampleStudents: insertedStudents.slice(0, 3).map(s => ({
          id: s._id,
          name: s.full_name,
          email: s.email,
          student_code: s.student_code,
          placement_status: s.placement_status
        }))
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Seed data error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Some students already exist (duplicate email/username/student_code)',
        error: 'Duplicate key error'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to seed student data',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Check current student count
export async function GET() {
  try {
    const connection = await connectDB();
    const { User } = getModels(connection);

    const stats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$placement_status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalStudents = await User.countDocuments({ role: 'student' });

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        placementStats: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to get student statistics',
      error: error.message
    }, { status: 500 });
  }
}
