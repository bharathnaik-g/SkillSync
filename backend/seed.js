const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Session = require("./models/Session");
const Message = require("./models/Message");
const Roadmap = require("./models/Roadmap");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully to MongoDB!");

    // Hash default password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // 1. Seed Student Users
    const usersData = [
      {
        name: "Ananya Sharma",
        email: "ananya@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Computer Science",
        year: 6,
        bio: "Frontend developer & UI designer passionate about building sleek React applications and peer mentoring.",
        skillsToTeach: ["React", "JavaScript", "UI/UX", "Tailwind CSS"],
        skillsToLearn: ["Python", "Machine Learning", "FastAPI"],
      },
      {
        name: "Rahul Kumar",
        email: "rahul@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Information Science",
        year: 5,
        bio: "Competitive programmer and DSA enthusiast. Love solving LeetCode problems and teaching OOP concepts in Java and C++.",
        skillsToTeach: ["Java", "DSA", "C++", "System Design"],
        skillsToLearn: ["React", "Node.js", "MongoDB"],
      },
      {
        name: "Sneha Rao",
        email: "sneha@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Computer Science",
        year: 4,
        bio: "Product designer interested in modern web frameworks, Figma design systems, and responsive frontends.",
        skillsToTeach: ["Figma", "UI/UX", "HTML", "CSS", "Graphic Design"],
        skillsToLearn: ["React", "TypeScript", "JavaScript"],
      },
      {
        name: "Arjun Shetty",
        email: "arjun@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Information Science",
        year: 7,
        bio: "Data Science & ML enthusiast with hands-on experience in computer vision, Pandas, and SQL database pipelines.",
        skillsToTeach: ["Python", "Machine Learning", "Data Science", "SQL"],
        skillsToLearn: ["Docker", "Kubernetes", "Cloud Architecture"],
      },
      {
        name: "Kiran Pai",
        email: "kiran@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Electronics & Communication",
        year: 6,
        bio: "IoT builder & robotics tinkerer. Enjoy interfacing hardware sensors with cloud dashboards using Raspberry Pi and Arduino.",
        skillsToTeach: ["Arduino", "IoT", "Embedded C", "Raspberry Pi"],
        skillsToLearn: ["Python", "React", "Node.js"],
      },
      {
        name: "Megha Rao",
        email: "megha@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Computer Science",
        year: 5,
        bio: "Backend developer focusing on Node.js microservices, MongoDB database optimization, and RESTful API security.",
        skillsToTeach: ["Node.js", "Express", "MongoDB", "REST APIs"],
        skillsToLearn: ["Cybersecurity", "Ethical Hacking", "Go"],
      },
      {
        name: "Vikram Verma",
        email: "vikram@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "AI & Machine Learning",
        year: 6,
        bio: "AI researcher working on neural networks, PyTorch image classification models, and deep learning algorithms.",
        skillsToTeach: ["PyTorch", "Deep Learning", "Computer Vision", "Python"],
        skillsToLearn: ["Java", "Android Development", "Flutter"],
      },
      {
        name: "Priya Nair",
        email: "priya@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Information Science",
        year: 4,
        bio: "Data analyst interested in relational database architecture, SQL queries, and financial tech analytics.",
        skillsToTeach: ["SQL", "PostgreSQL", "Database Design", "Excel"],
        skillsToLearn: ["DSA", "Java", "Python"],
      },
      {
        name: "Kavya Hegde",
        email: "kavya@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Computer Science",
        year: 5,
        bio: "Cross-platform mobile developer building Android & iOS applications with Flutter and Dart.",
        skillsToTeach: ["Flutter", "Dart", "Mobile App Dev", "Firebase"],
        skillsToLearn: ["Node.js", "GraphQL", "Docker"],
      },
      {
        name: "Siddharth Patel",
        email: "siddharth@college.edu",
        password: hashedPassword,
        college: "St. Joseph Engineering College",
        department: "Electronics & Communication",
        year: 7,
        bio: "CTF player and Linux sysadmin focused on penetration testing, network security, and defense systems.",
        skillsToTeach: ["Cybersecurity", "Linux", "Ethical Hacking", "Network Security"],
        skillsToLearn: ["Python", "Cloud Architecture", "Go"],
      },
    ];

    console.log("Upserting realistic student profiles...");
    const createdUsers = [];
    for (const uData of usersData) {
      const user = await User.findOneAndUpdate(
        { email: uData.email },
        { $set: uData },
        { upsert: true, new: true, runValidators: true }
      );
      createdUsers.push(user);
    }
    console.log(`Successfully seeded ${createdUsers.length} student profiles!`);

    // Map users by email for session seeding
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    const ananya = userMap["ananya@college.edu"];
    const rahul = userMap["rahul@college.edu"];
    const sneha = userMap["sneha@college.edu"];
    const arjun = userMap["arjun@college.edu"];
    const megha = userMap["megha@college.edu"];
    const kiran = userMap["kiran@college.edu"];

    // 2. Seed Sample Sessions
    console.log("Seeding sample sessions...");
    
    // Clear old sample test sessions for clean state
    await Session.deleteMany({
      $or: [
        { requester: { $in: [ananya._id, rahul._id, sneha._id, arjun._id] } },
        { mentor: { $in: [ananya._id, rahul._id, sneha._id, arjun._id] } },
      ],
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    nextWeek.setHours(15, 30, 0, 0);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    const sessionsData = [
      {
        requester: rahul._id,
        mentor: ananya._id,
        skill: "React",
        message: "Hi Ananya! I want to build a React dashboard for my college project. Could you guide me on Hooks and State Management?",
        scheduledAt: tomorrow,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "accepted",
      },
      {
        requester: sneha._id,
        mentor: rahul._id,
        skill: "Java",
        message: "Hey Rahul! Need help understanding Object-Oriented Programming (Inheritance & Polymorphism) in Java.",
        scheduledAt: nextWeek,
        meetingLink: "https://meet.google.com/xyz-uvwx-rst",
        status: "accepted",
      },
      {
        requester: ananya._id,
        mentor: arjun._id,
        skill: "Python",
        message: "Hi Arjun! I want to start learning Python data analysis with Pandas. Are you available for a 1-on-1 session?",
        scheduledAt: nextWeek,
        meetingLink: "",
        status: "pending",
      },
      {
        requester: kiran._id,
        mentor: megha._id,
        skill: "Node.js",
        message: "Hi Megha! Need assistance connecting my IoT sensor dashboard to an Express REST API.",
        scheduledAt: nextWeek,
        meetingLink: "",
        status: "pending",
      },
      {
        requester: sneha._id,
        mentor: ananya._id,
        skill: "UI/UX",
        message: "Session on UI design principles and Tailwind CSS layout techniques.",
        scheduledAt: pastDate,
        meetingLink: "https://meet.google.com/pqr-stuv-wxy",
        status: "completed",
      },
    ];

    const createdSessions = await Session.insertMany(sessionsData);
    console.log(`Successfully seeded ${createdSessions.length} sessions!`);

    // 3. Seed Sample Chat Messages for accepted session (Rahul & Ananya)
    const activeSession = createdSessions.find(
      (s) => s.requester.toString() === rahul._id.toString() && s.mentor.toString() === ananya._id.toString()
    );

    if (activeSession) {
      console.log("Seeding chat message history...");
      await Message.deleteMany({ session: activeSession._id });

      const messagesData = [
        {
          session: activeSession._id,
          sender: rahul._id,
          text: "Hi Ananya! Thanks for accepting my React learning request.",
        },
        {
          session: activeSession._id,
          sender: ananya._id,
          text: "Hey Rahul! Happy to help. React is awesome once you understand components and props.",
        },
        {
          session: activeSession._id,
          sender: rahul._id,
          text: "Great! I've set up my Vite project. See you tomorrow at 10 AM on Google Meet.",
        },
        {
          session: activeSession._id,
          sender: ananya._id,
          text: "Sounds good! I added the Google Meet link above. Feel free to bring any questions!",
        },
      ];

      await Message.insertMany(messagesData);
      console.log(`Successfully seeded ${messagesData.length} chat messages!`);
    }

    // 4. Seed Sample AI Roadmaps
    console.log("Seeding sample AI roadmaps...");
    await Roadmap.deleteMany({ user: { $in: [rahul._id, ananya._id] } });

    const roadmapsData = [
      {
        user: rahul._id,
        skill: "React",
        currentLevel: "Beginner",
        goal: "Build modern full-stack web applications with React and Node.js",
        steps: [
          {
            title: "Stage 1: Core JavaScript & ES6+",
            topics: ["Arrow Functions", "Array Methods (map, filter, reduce)", "Destructuring", "Promises & Async/Await"],
            project: "Build a JavaScript To-Do App with LocalStorage",
            duration: "1 week",
          },
          {
            title: "Stage 2: React Component Fundamentals",
            topics: ["JSX Syntax", "Functional Components", "Props & Prop Validation", "State with useState"],
            project: "Build an Interactive Counter & Product Card Component",
            duration: "2 weeks",
          },
          {
            title: "Stage 3: Hooks & Side Effects",
            topics: ["useEffect Lifecycle", "Custom Hooks", "Fetching API Data with fetch/axios", "Form Handling"],
            project: "Build a Real-Time Weather Dashboard App",
            duration: "2 weeks",
          },
          {
            title: "Stage 4: State Management & Routing",
            topics: ["React Router DOM v7", "Context API", "Global Auth State", "Protected Routes"],
            project: "Build a Multi-Page SkillSync App Frontend",
            duration: "2 weeks",
          },
        ],
      },
      {
        user: ananya._id,
        skill: "Python & Machine Learning",
        currentLevel: "Beginner",
        goal: "Master Python data science libraries and build predictive ML models",
        steps: [
          {
            title: "Stage 1: Python Programming Basics",
            topics: ["Data Types & Data Structures", "Control Flow", "Functions & Modules", "File Handling"],
            project: "Build a CLI Data Calculator",
            duration: "1 week",
          },
          {
            title: "Stage 2: Data Manipulation with NumPy & Pandas",
            topics: ["NumPy Arrays & Vectorization", "Pandas DataFrames", "Data Cleaning & Imputation", "Exploratory Data Analysis"],
            project: "Analyze Housing Prices Dataset",
            duration: "2 weeks",
          },
          {
            title: "Stage 3: Machine Learning Algorithms",
            topics: ["Linear Regression", "Logistic Regression", "Decision Trees & Random Forests", "Scikit-Learn Workflows"],
            project: "Build a Customer Churn Prediction Model",
            duration: "3 weeks",
          },
        ],
      },
    ];

    await Roadmap.insertMany(roadmapsData);
    console.log(`Successfully seeded ${roadmapsData.length} AI Roadmaps!`);

    console.log("\n=======================================================");
    console.log("   DATABASE SEEDING COMPLETE FOR SKILLSYNC!   ");
    console.log("=======================================================");
    console.log("Seeded User Credentials (Password: password123):");
    createdUsers.forEach((u) => {
      console.log(`- ${u.name.padEnd(18)} | ${u.email.padEnd(25)} | ${u.department}`);
    });
    console.log("=======================================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
};

seedDatabase();
