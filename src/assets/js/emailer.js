import emailjs from "@emailjs/browser";

// TODO

emailjs.init(import.meta.env.VITE_PUBLIC_KEY);

export async function sendProjectEmail(projectData) {
  const projectUrl = `http://localhost:5173/?projectName=${projectData.projectName}&projectDescription=${projectData.projectDescription}&projectLead=${projectData.projectLead}&dateCreated=${projectData.dateCreated}`;
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      { ...projectData, projectUrl }
    );

    console.dir(response);
    return response
  } catch (error) {
    return error;
  }
}
