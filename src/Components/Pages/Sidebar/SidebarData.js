import dashboard from '../../../Images/icons/dashboard_new.svg'
import study from '../../../Images/icons/abroad_new.svg'
import note from '../../../Images/icons/blog_new.svg'
import course from '../../../Images/icons/course_new.svg'
import student from '../../../Images/icons/student_new.svg'


export const SidebarData =[
    {
        navItem: 'Dashboard',
        id: 'dashboard',
        // show: false,
        img: dashboard,
        imgDark: dashboard,
        link: '/dashboard',
        bgShade: 'linear-gradient(to right, #f3fffa, #f3fffa)',
      },
      {
        navItem: 'Abroad',
        id: 'abroad',
        // show: false,
        img: study,
        // imgSelected: learningSupportSelected,
        link: '/abroad',
        bgShade: 'linear-gradient(to right,rgb(0, 137, 249),rgb(0, 55, 255))',
      },
      {
        navItem: 'Blog',
        id: 'blog',
        // show: false,
        img: note,
        imgDark:note,
        // imgSelected: learningSupportSelected,
        link: '/blog',
        bgShade: 'linear-gradient(to right,rgb(0, 137, 249),rgb(0, 55, 255))',
      },
      {
        navItem: 'Course',
        id: 'course',
        // show: false,
        img: course,
        imgDark:course,
        // imgSelected: learningSupportSelected,
        link: '/course',
        bgShade: 'linear-gradient(to right,rgb(0, 137, 249),rgb(0, 55, 255))',
      },
      {
        navItem: 'Students',
        id: 'students',
        // show: false,
        img: student,
        imgDark:student,
        // imgSelected: learningSupportSelected,
        link: '/students',
        bgShade: 'linear-gradient(to right,rgb(0, 137, 249),rgb(0, 55, 255))',
      },
      {
        navItem: 'Users',
        id: 'users',
        // show: false,
        img: student,
        imgDark:student,
        // imgSelected: learningSupportSelected,
        link: '/users',
        bgShade: 'linear-gradient(to right,rgb(0, 137, 249),rgb(0, 55, 255))',
      }
     
]