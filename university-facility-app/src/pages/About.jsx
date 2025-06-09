import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { ChevronDown, ChevronUp, Github, Linkedin, Mail } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
  color: var(--dark-gray, #555);
  animation: ${fadeIn} 0.5s ease-in;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const SectionTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #2c3e50);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color, #2c3e50);
  margin: 2rem 0 1rem;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const MemberList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MemberItem = styled.li`
  background-color: #f8f9fa;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const MemberName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color, #2c3e50);
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray, #555);
  margin-bottom: 0.25rem;
`;

const MemberBio = styled.p`
  font-size: 0.9rem;
  color: #666;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  margin-top: 0.5rem;
`;

const SocialLinks = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialIcon = styled.a`
  color: var(--primary-color, #2c3e50);
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-color, #e74c3c);
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TechTag = styled.span`
  background-color: #eee;
  color: #555;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ddd;
    & > div {
      display: block;
    }
  }
`;

const TechTooltip = styled.div`
  display: none;
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color, #2c3e50);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
`;

const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--light-gray, #ccc);
  }
`;

const TimelineItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-left: 2rem;
  position: relative;
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    left: 0.75rem;
    top: 0.5rem;
    width: 10px;
    height: 10px;
    background-color: var(--primary-color, #2c3e50);
    border-radius: 50%;
  }

  &:hover {
    & > div {
      background-color: #f8f9fa;
    }
  }
`;

const TimelineContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  transition: background-color 0.2s ease;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const FormInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--light-gray, #ccc);
  border-radius: 4px;
  font-size: 1rem;
`;

const FormTextarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid var(--light-gray, #ccc);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
`;

const FormButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color, #2c3e50);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--accent-color, #e74c3c);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FormMessage = styled.p`
  font-size: 0.9rem;
  color: ${({ $isError }) =>
    $isError ? "var(--danger, #e74c3c)" : "var(--success, #27ae60)"};
`;

function About() {
  const [openMembers, setOpenMembers] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    message: "",
    isError: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupMembers = [
    {
      name: "Poorna Rashmika",
      role: "Team Lead & Backend Developer",
      contribution:
        "Led project coordination, developed Flask API endpoints for shop items and reviews, integrated python-socketio for real-time updates, and ensured seamless backend-frontend communication.",
      bio: "A skilled Python developer with a focus on Flask and real-time systems, Poorna drives the team with a vision for efficient backend solutions.",
      github: "https://github.com/poorna-rashmika",
      linkedin: "https://linkedin.com/in/poorna-rashmika",
    },
    {
      name: "Sachintha Dilshan",
      role: "Frontend Developer",
      contribution:
        "Implemented ShopPage and FacilityCard components, handled time formatting (12:00:00 to 12:00), set up react-router-dom for navigation, and styled the app with styled-components.",
      bio: "A React specialist passionate about creating responsive and user-friendly interfaces, Sachintha enhances the app’s frontend experience.",
      github: "https://github.com/sachintha-dilshan",
      linkedin: "https://linkedin.com/in/sachintha-dilshan",
    },
    {
      name: "Nagitha Samarakkodi",
      role: "Database Handler",
      contribution:
        "Designed and optimized PostgreSQL schemas on DigitalOcean for facilities, reviews, and shop data, wrote complex queries for data retrieval, and ensured database scalability.",
      bio: "An expert in database management, Nagitha ensures the app’s data is robust, secure, and efficiently accessible.",
      github: "https://github.com/nagitha-samarakkodi",
      linkedin: "https://linkedin.com/in/nagitha-samarakkodi",
    },
    {
      name: "Sanduni Liyange",
      role: "UI/UX Designer",
      contribution:
        "Crafted wireframes and mockups for ShopPage and ReviewsSection, designed intuitive user flows, and conducted usability testing to refine the app’s interface.",
      bio: "A creative designer with a keen eye for user experience, Sanduni shapes the app’s visual and navigational appeal.",
      github: "https://github.com/sanduni-liyange",
      linkedin: "https://linkedin.com/in/sanduni-liyange",
    },{
      name: "Sachin Maleesha",
      role: "Map API Integrator",
      contribution:
        "Integrated Google Maps API for displaying facility locations, implemented interactive maps with markers, and ensured responsive design for mobile and desktop views.",
      bio: "A skilled developer with a passion for geolocation services, Sachin enhances the app’s functionality with dynamic map features.",
      github: "https://github.com/sachin-maleesha",
      linkedin: "https://linkedin.com/in/sachin-maleesha",
    },
  ];

  const techStack = [
    {
      name: "React",
      description: "JavaScript library for building user interfaces.",
    },
    {
      name: "styled-components",
      description: "CSS-in-JS for styling React components.",
    },
    {
      name: "react-router-dom",
      description: "Declarative routing for React applications.",
    },
    {
      name: "axios",
      description: "Promise-based HTTP client for API requests.",
    },
    {
      name: "socket.io",
      description: "Real-time bidirectional event-based communication.",
    },
    {
      name: "Flask",
      description: "Python micro-framework for backend API development.",
    },
    {
      name: "PostgreSQL",
      description: "Open-source relational database hosted on DigitalOcean.",
    },
    {
      name: "lucide-react",
      description: "Icon library for React applications.",
    },
  ];

  const timelineEvents = [
    {
      date: "March 2025",
      title: "Project Kickoff & Planning",
      description:
        "Defined project scope, created wireframes, set up Flask backend, and assigned team roles.",
    },
    {
      date: "April 2025",
      title: "Core Development",
      description:
        "Developed Flask APIs, configured PostgreSQL on DigitalOcean, and built ShopPage and FacilityCard components.",
    },
    {
      date: "May 2025",
      title: "Feature Implementation",
      description:
        "Integrated socket.io for real-time updates, implemented ReviewsSection, and added routing with react-router-dom.",
    },
    {
      date: "June 2025",
      title: "Testing & Deployment",
      description:
        "Conducted user testing, fixed bugs, and deployed the app for University of Moratuwa use.",
    },
  ];

  const toggleMember = (index) => {
    setOpenMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: "", isError: false });

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        message: "Please fill in all fields.",
        isError: true,
      });
      setIsSubmitting(false);
      return;
    }

    // Mock API submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setFormStatus({
        message: "Thank you for your feedback! We’ll get back to you soon.",
        isError: false,
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AboutContainer>
      <SectionTitle>About Our App</SectionTitle>

      <SubTitle>Project Overview</SubTitle>
      <Paragraph>
        This facility management system, developed for the University of Moratuwa, allows students and staff to browse campus facilities, submit reviews, and pre-order from shops. Powered by a Flask backend and PostgreSQL on DigitalOcean, it features real-time shop status updates via socket.io, intuitive facility cards, and a robust review system to enhance the campus experience.
      </Paragraph>

      <SubTitle>Our Team</SubTitle>
      <MemberList>
        {groupMembers.map((member, index) => (
          <MemberItem key={index} onClick={() => toggleMember(index)}>
            <MemberHeader>
              <div>
                <MemberName>{member.name}</MemberName>
                <MemberRole>Role: {member.role}</MemberRole>
              </div>
              {openMembers[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </MemberHeader>
            <MemberBio $isOpen={openMembers[index]}>
              Contribution: {member.contribution}
              <br />
              Bio: {member.bio}
            </MemberBio>
            <SocialLinks $isOpen={openMembers[index]}>
              <SocialIcon href={member.github} target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </SocialIcon>
              <SocialIcon href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </SocialIcon>
            </SocialLinks>
          </MemberItem>
        ))}
      </MemberList>

      <SubTitle>Technologies Used</SubTitle>
      <TechList>
        {techStack.map((tech, index) => (
          <TechTag key={index}>
            {tech.name}
            <TechTooltip>{tech.description}</TechTooltip>
          </TechTag>
        ))}
      </TechList>

      <SubTitle>Project Timeline</SubTitle>
      <Timeline>
        {timelineEvents.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineContent>
              <strong>{event.date}</strong>: {event.title}
              <Paragraph>{event.description}</Paragraph>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <SubTitle>Contact Us</SubTitle>
      <Paragraph>
        Have feedback or questions about the app? Send us a message!
      </Paragraph>
      <ContactForm onSubmit={handleFormSubmit}>
        <FormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Your Name"
          required
        />
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          placeholder="Your Email"
          required
        />
        <FormTextarea
          name="message"
          value={formData.message}
          onChange={handleFormChange}
          placeholder="Your Message"
          required
        />
        <FormButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </FormButton>
        {formStatus.message && (
          <FormMessage $isError={formStatus.isError}>
            {formStatus.message}
          </FormMessage>
        )}
      </ContactForm>

      <SubTitle>University Context</SubTitle>
      <Paragraph>
        Built for the University of Moratuwa, this app supports students and staff by providing a centralized platform for facility management, aligning with the university’s goal of enhancing campus services.
      </Paragraph>

      <SubTitle>Acknowledgments</SubTitle>
      <Paragraph>
       University of Moratuwa’s Faculty of information technology for their guidance. Special thanks to our peers for their feedback and support.
      </Paragraph>
    </AboutContainer>
  );
}

export default About;