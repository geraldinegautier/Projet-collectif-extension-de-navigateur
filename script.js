// Fonction asynchrone pour rechercher un mot dans l'API du dictionnaire
async function searchWord(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  let response, data;

  try {
    // Effectuer la requête à l'API et obtenir les données en format JSON
    response = await fetch(url);
    data = await response.json();
  }
  catch (error) {
    // Gérer les erreurs lors de la requête API
    alert("Failed to fetch data");
    return;
  }

  // Fonction pour obtenir une définition en utilisant un index, avec gestion des erreurs
  const getDefinition = (index) => {
    try {
      return data[0].meanings[0].definitions[index].definition;
    }
    catch {
      return `Definition ${index + 1} not available`;
    }
  };

  // Fonction pour obtenir un synonyme, avec gestion des erreurs
  const getSynonym = () => {
    try {
      return data[0].meanings[0].synonyms[0];
    }
    catch {
      return "Synonym not available";
    }
  };

  // Fonction pour obtenir l'URL de l'audio, avec gestion des erreurs
  const getAudioUrl = () => {
    try {
      return data[0].phonetics[0].audio;
    }
    catch {
      return "Audio not available";
    }
  };

  // Appeler les fonctions pour obtenir les données nécessaires
  const definition = getDefinition(0);
  const synonym = getSynonym();
  const definition2 = getDefinition(1);
  const audioUrl = getAudioUrl();

  // Appeler la fonction pour afficher les données dans une nouvelle fenêtre
  displayWord(word, definition, synonym, definition2, audioUrl);
}

// Fonction pour afficher les résultats de la recherche dans une nouvelle fenêtre
function displayWord(word, definition, synonym, definition2, audioUrl) {
  // Ouvrir une nouvelle fenêtre pop-up
  const newWin = window.open("about:blank", "popUpName", "width=400,height=400");
  // Écrire le style CSS et le contenu initial dans la nouvelle fenêtre
  newWin.document.write(`<style>
    body {
        background: #FCEDF2;
    }
    strong, em {
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }
    strong {
        color: #885df1;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.5em;
        transition: all 150 ease;
        text-decoration: underline;
    }
    strong:hover {
        opacity: 0,7;
        color: #ec4f81;
        font-size: 20px;
    }
    em {
        color: #272144;
        text-align: center;
        line-height: 1.5em;
        margin-bottom: 15px;
        margin-top: 30px;
        margin-left: 3px;
    }

    button {
        color: #FFF;
        display: block;
        font-size: 16px; 
        padding: 10px 14px; 
        border: 1px solid #694AED;
        border-radius: 25px 25px 25px 25px;
        box-shadow: 4px 4px 4px #DCB5FE;
        background: #885df1;
        pointer: cursor;
        transition: all 150 ease-in-out;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    button:hover {
        background: #FFF;
        color: #885df1;
    }
    </style>
    <strong>First definition of ${word} :</strong><br><em>${definition}</em><br>
    <strong>Synonyms of ${word}</strong><br><em>${synonym}</em><br>
    `);

  // Fonction pour créer et ajouter un bouton avec un gestionnaire d'événements
  const createButton = (text, onClick) => {
    const button = newWin.document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    newWin.document.body.appendChild(button);
  };

  // Ajouter un bouton pour afficher la deuxième définition
  createButton("Definition 2", () => {
    newWin.document.write(`<br><strong>Second definition of ${word}:</strong><br><em>${definition2}</em><br>`);
  });

  // Ajouter un bouton pour écouter la prononciation
  createButton("Listen to the pronunciation", () => {
    const audio = newWin.document.createElement("audio");
    audio.src = audioUrl;
    audio.controls = true;
    newWin.document.body.appendChild(audio);
  });
}

// Ajouter un écouteur d'événement pour détecter la sélection de texte et appeler la fonction de recherche
document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim(); //trim() : supprime les espaces blancs (espaces, tabulations, sauts de ligne) au début et à la fin d'une chaîne de caractères
  if (selectedText) { // vérifie si selectedText est non vide cad == True
    searchWord(selectedText);
  }
});
