document.addEventListener("DOMContentLoaded", function () {
	const reponseReclamations = document.getElementById("reclamations");
	const divReclamation = document.getElementById("presenceReclamations");
	const nbrReclamationEntrees = document.getElementById("nbrReclamations"); //inputNbrReclamation
	const divMontantReclamations = document.getElementById("montantReclamations");
	let totalReclamations = 0;
	let nbrReclamations;

	//Recuperation de la reponse du client, s'il a deja fait des reclamations
	reponseReclamations.addEventListener("change", function () {
		if (reponseReclamations.value === "oui") {
			divReclamation.style.display = "block";
		} else {
			divReclamation.style.display = "none";
		}
	});

	//Affichage des labels au meme nombre de reclamations
	nbrReclamationEntrees.addEventListener("change", function () {
		let nombreReclams = nbrReclamationEntrees.value;
		divMontantReclamations.innerHTML = "";
		for (let i = 1; i <= nombreReclams; i++) {
			const div = document.createElement("div");
			div.textContent = `Réclamation #${i}, quel montant avez-vous réclamé?`;
			const textInput = document.createElement("input");
			div.appendChild(textInput);
			divMontantReclamations.appendChild(div);
			div.id = `reclamation_${i}`;
		}
	});

	// Validation de la date de naissance
    document.getElementById('dateNaissance').addEventListener('change', function () {
        const dateNaissance = new Date(this.value);
        const dateErreur = document.getElementById('dateErreur');
        const dateAujourdhui = new Date();

        if (isNaN(dateNaissance) || dateNaissance >= dateAujourdhui) {
            dateErreur.style.display = 'inline';
        } else {
            dateErreur.style.display = 'none';
        }
    });

    // Validation de l'annee de la voiture
    document.getElementById('anneeFabrication').addEventListener('change', function () {
    	const annee = parseInt(this.value, 10);
        const anneeErreur = document.getElementById('anneeErreur');
        const anneeActuelle = new Date().getFullYear();

        if (isNaN(annee) || annee < 1900 || annee > anneeActuelle) {
            anneeErreur.style.display = 'inline'; // Afficher le message d'erreur
        } else {
            anneeErreur.style.display = 'none'; // Cacher le message d'erreur
        }
    });


	formulaireSoumission.addEventListener("submit", function (evenement) {
		evenement.preventDefault();

		//Recuperation des informations du formulaire
		const genre = document.getElementById("genre").value;
		const dateNaissance = document.getElementById("dateNaissance").value;
		const valeurAchat = parseInt(document.getElementById("valeurAchat").value);
		const anneeFabrication = parseInt(
			document.getElementById("anneeFabrication").value
		);
		const kilometre = parseInt(document.getElementById("kilometre").value);
		const cameraRecul = document.getElementById("cameraRecul").value;
		nbrReclamations = document.getElementById("nbrReclamations").value;

		//Verification des conditions d'admissibilite
		const affichageSoumission = document.getElementById("resultat");
		console.log(new Date().getFullYear() - anneeFabrication);

		for (let index = 1; index <= nbrReclamations; index++) {
			totalReclamations += document.getElementById(`reclamation_${index}`).value;
		}
		if (
			!(
				(genre === "femme" && calculerAge(dateNaissance) < 16) ||
				(genre === "homme" && calculerAge(dateNaissance) < 18) ||
				(genre === "non-binaire" && calculerAge(dateNaissance) < 18) ||
				calculerAge(dateNaissance) > 100 ||
				new Date().getFullYear() - anneeFabrication > 25 ||
				valeurAchat > 100000 ||
				nbrReclamations > 4 ||
				totalReclamations > 35000 ||
				kilometre > 50000 ||
				cameraRecul === "non"
			)
		) {
			let basePaiement = 1.5;
			let assuranceAnnuelle;

			if (genre != "femme" && calculerAge(dateNaissance) < 25) basePaiement = 5;

			if (calculerAge(dateNaissance) >= 75) basePaiement = 4;

			//Calcul du montant d'assurance
			assuranceAnnuelle =
				(basePaiement / 100) * valeurAchat +
				350 * nbrReclamations +
				0.02 * kilometre;

			if (totalReclamations > 25000) assuranceAnnuelle += 700;
			let assuranceMensuelle = assuranceAnnuelle / 12;

			// Affichage des resultats

			let p = document.createElement("p");
			p.innerHTML = `Prix annuel de la soumission d'assurance : ${assuranceAnnuelle.toFixed(2)} $`;
			affichageSoumission.append(p);

			let p1 = document.createElement("p");
			p1.innerHTML = `Montant de la prime mensuelle : ${assuranceMensuelle.toFixed(2)} $`;
			affichageSoumission.append(p1);

			affichageSoumission.style.display = "block";
		}

		else {
			// Dans le cas ou le client n'est pas admissible
			let pErreur = document.createElement("p");
			pErreur.innerHTML = `Désolé, nous n'avons aucun produit à offrir pour ce profil de client.`;

			affichageSoumission.innerHTML = "";
			affichageSoumission.append(pErreur);
			affichageSoumission.style.display = "block";
		}
	});

	function calculerAge(dateNaissance) {
		const dateDeNaissance = new Date(dateNaissance);
		const dateAujourdhui = new Date();

		//Verification du mois
		const nbrMois = dateAujourdhui.getMonth() - dateDeNaissance.getMonth();

		//Difference d'annees
		let age = dateAujourdhui.getFullYear() - dateDeNaissance.getFullYear();
		if (
			nbrMois < 0 ||
			(nbrMois === 0 && dateAujourdhui.getDate() < dateDeNaissance.getDate())
		) {
			age--;
		}
		return age;
	}

	const reinitialiser = document.getElementById("reinitialiser");
	reinitialiser.addEventListener("click", function () {
		location.reload();
	});
});
