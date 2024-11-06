document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('projectButton').onclick = function() {
      document.getElementById('myModal').classList.remove('invisible');
  }

  document.getElementsByClassName('close')[0].onclick = function() {
      document.getElementById('myModal').classList.add('invisible');
  }

  window.onclick = function(event) {
      if (event.target == document.getElementById('myModal')) {
          document.getElementById('myModal').classList.add('invisible');
      }
  }

  document.getElementById('projectImage').onchange = function(event) {
      const reader = new FileReader();
      reader.onload = function() {
          document.getElementById('imagePreview').src = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);
  }

  document.getElementById('addProjectButton').onclick = function() {
      const projectName = document.getElementById('projectName').value;
      const projectDescription = document.getElementById('projectDescription').value;
      const projectImage = document.getElementById('imagePreview').src;

      const projectContainer = document.createElement('div');
      projectContainer.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-lg');
      projectContainer.setAttribute('draggable', 'true');
      projectContainer.ondragstart = drag;

      const projectImageElement = document.createElement('img');
      projectImageElement.src = projectImage;
      projectImageElement.classList.add('w-full', 'h-48', 'object-cover', 'rounded-md', 'mb-4');

      const projectNameElement = document.createElement('h2');
      projectNameElement.textContent = projectName;
      projectNameElement.classList.add('text-2xl', 'font-bold', 'mb-2');

      const projectDescriptionElement = document.createElement('p');
      projectDescriptionElement.textContent = projectDescription;
      projectDescriptionElement.classList.add('text-gray-700');

      const completeCheckbox = document.createElement('input');
      completeCheckbox.type = 'checkbox';
      completeCheckbox.classList.add('mt-4');
      completeCheckbox.onchange = function() {
          if (completeCheckbox.checked) {
              document.getElementById('completedProjects').appendChild(projectContainer);
          } else {
              document.getElementById('newProjects').appendChild(projectContainer);
          }
      };

      projectContainer.appendChild(projectImageElement);
      projectContainer.appendChild(projectNameElement);
      projectContainer.appendChild(projectDescriptionElement);
      projectContainer.appendChild(completeCheckbox);

      document.getElementById('newProjects').appendChild(projectContainer);

      // Clear the modal inputs
      document.getElementById('projectName').value = '';
      document.getElementById('projectDescription').value = '';
      document.getElementById('imagePreview').src = 'path/to/image.jpg';
      document.getElementById('projectImage').value = '';

      document.getElementById('myModal').classList.add('invisible');
  }

  // Set dynamic year in footer
  const footer = document.getElementById('footer');
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `&copy; ${currentYear} Tev and Brandon`;
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const project = document.getElementById(data);
  event.target.appendChild(project);
}