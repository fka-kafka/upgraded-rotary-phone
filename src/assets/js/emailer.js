import emailjs from "@emailjs/browser";

// TODO
// change emailjs email template

emailjs.init(import.meta.env.VITE_PUBLIC_KEY);

export async function sendProjectEmail(projectData) {
  const projectUrl = `http://localhost:5173/?addProject=${projectData.projectName}&projectDescription=${projectData.projectDescription}&projectLead=${projectData.projectLead}&dateCreated=${projectData.dateCreated}`;
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      { ...projectData, projectUrl }
    );

    console.dir(response);
  } catch (error) {
    return error;
  }
}

