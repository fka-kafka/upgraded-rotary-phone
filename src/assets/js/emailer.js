import emailjs from "@emailjs/browser";

emailjs.init(import.meta.env.VITE_PUBLIC_KEY);

export async function sendProjectEmail(projectData) {
  const displayDate = `${new Date(projectData.dateCreated).toLocaleDateString('en-GB')} ${new Date(projectData.dateCreated).toLocaleTimeString('en-GB')}`
  const projectUrl = `http://localhost:5173/?projectName=${projectData.projectName}&repositoryName=${projectData.repositoryName}&projectDescription=${projectData.projectDescription}&projectLead=${projectData.projectLead}&dateCreated=${projectData.dateCreated}`;
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      { ...projectData, projectUrl, displayDate }
    );

    return response
  } catch (error) {
    return error;
  }
}
