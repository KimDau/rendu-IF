window.onload = Configurer;

var n = 26;
var m = 18;
var tailleLaby = n*m;

var entree;
var sortie;

//Déclaration d'un tableau à 2 dim. permettant de renseigner si
//un mur entre 2 cellules est disponible.
//Forme utilisée : mursDispo [cellule1][cellule2]
//avec cellule1 et cellule2 les valeurs des cases initiales

var mursDispo = new Array (tailleLaby);
for(i=0; i<tailleLaby; i++) 
{
	mursDispo[i] = new Array(tailleLaby);
}

var tableauModif = new Array (tailleLaby);
var curseur=0;
var quete;
var conditionsVictoire = false;

function Configurer()
{
	CreerLaby();
	document.getElementById("generer").onclick = CreerLaby;
	document.getElementById("robuste").onclick = ModeRobuste;
}

function ModeRobuste ()
{
	n = 35;
	m = 22;
	tailleLaby = n*m;
	for(i=0; i<tailleLaby; i++) 
	{
	mursDispo[i] = new Array(tailleLaby);
	}
	
	document.getElementById("robuste").innerHTML = "mode robuste activé";
	document.getElementById("robuste").style.border = "none";
	document.getElementById("robuste").style.cursor = "auto";
	document.getElementById("robuste").onclick = "";
	CreerLaby();
}

function ModeSimple ()
{
	n = 26;
	m = 18;
	tailleLaby = n*m;
	for(i=0; i<tailleLaby; i++) 
	{
	mursDispo[i] = new Array(tailleLaby);
	}
	
}

function CreerLaby()
{
	//CreationTableau();
	chaineHTML = "";
	for (i=0;i<tailleLaby;i++)
	{
		if (i>0 && i%n == 0) chaineHTML += "</tr><tr>";

		tableauModif[i] = i;
		chaineHTML += RenseignerMursDisponibles(i);
		
	}
	document.getElementById("tableau").innerHTML = chaineHTML;
	
	var compteurMursOuvert = 0;
	
	//Ouverture des portes du labyrinthe
	while(compteurMursOuvert < tailleLaby-1)
	{
		compteurMursOuvert += ChoisirPorteAleatoire();
	}
	
	//Choix de l'entrée et de la sortie
	EntreeSortieAleatoire();
	document.onkeydown = applyKey;



}


function RenseignerMursDisponibles(cel)
{
	//on part du principe suivant :
	//chaque case a deux portes, une à droite et une en dessous,
	//sauf : - celles tout à droite (juste une en dessous)
	// - celles tout en bas (juste sur la droite)
	// - dans le coin en bas à droite (aucune)
	
	
	// 1. si la case traitée ≠ du coin
	if(cel < (tailleLaby-1))
	{
		// 2. Si la case traitée est une case tout à droite
		if ((cel+1)%n == 0)
		{
			//dans ce cas, le mur entre la case cel et sa voisine du dessous (cel+n) est dispo
			mursDispo[cel][cel+n] = true;
			return "<td id='"+cel+"' style='border-bottom:1px solid black'></td>";
		}
		
		// 2. Sinon, elle est soit dans le centre, soit tout en bas
		else
		{
			//dans ce cas, le mur entre la case cel et sa voisine de droite est dispo
			mursDispo[cel][cel+1] = true;
			aRetourner = "<td id='"+i+"' style='border-right:1px solid black;";
			//3. si la case n'est pas tout en bas
			if (cel < tailleLaby-n)
			{
				//le mur entre la case cel et sa voisine du dessous est dispo
				mursDispo[cel][cel+n] = true;
				//du coup, on ajoute un style pour border-bottom
				aRetourner +="border-bottom:1px solid black'></td>"
			}
			//3. Si elle est tout en bas, on n'ajoute pas de style pour la bordure-bottom
			else { aRetourner += "'></td>";}
			return aRetourner;
		}
	}
	//1. sinon, la case traitée est le coin
	else
	{
		return "<td id='"+cel+"'></td>";
	}
}



function ChoisirPorteAleatoire()
{
	var tableau1 = new Array (tailleLaby);
	var tableau2 = new Array (tailleLaby);
	var compteur = 0;
	//Définir le nombre de murs disponibles et stocker les 2 cellules concernées
	//dans 2 tableaux différents mais à des indices identiques.
	//Cela permettra de les récupérer après avoir choisi un nombre au hasard
	for (i=0;i<tailleLaby;i++)
	{
		if(mursDispo[i][i+1] == true) { tableau1[compteur] = i; tableau2[compteur] = i+1;compteur++; }
		if(mursDispo[i][i+n] == true) { tableau1[compteur] = i; tableau2[compteur] = i+n; compteur++;}
	}
	//choix d'un nombre compris entre 0 et le nombre maximum de murs disponibles restants
	chiffreMystere = Math.floor(Math.random()*compteur);
	//Exécution de OuvrirPorte qui prend les coordonnées des cases voisines choisies
	if (OuvrirPorte(tableau1[chiffreMystere],tableau2[chiffreMystere])) return 1;
	else return 0;

}

function OuvrirPorte(cellule1,cellule2)
{
	if (!comparerSurfaceCellules(cellule1,cellule2))
	{
		//on rend indisponible le mur entre deux cellules
		mursDispo[cellule1][cellule2] = false;
		//on supprime physiquement la bordure
		if (cellule2-cellule1 == n)	
		{
			SupprimerMur(cellule1,"bottom");
		}
		//cas ou le mur en question est à droite
		if (cellule2-cellule1 == 1)	
		{
			SupprimerMur(cellule1,"right");
		}
		
		//on garde en mémoire la valeur de surface à remplacer
		var ancienneSurface = tableauModif[cellule2];
		for (j=0;j<tailleLaby;j++)
		{
			//on remplace par la valeur de surface de la cellule1 toutes les cellules 
			//dont la valeur de surface était actuellement celle de la cellule2
			if (tableauModif[j] == ancienneSurface) 
			{ 
				tableauModif[j] = tableauModif[cellule1]; 
			}
		}
		return 1;
	}
	else
	{
		mursDispo[cellule1][cellule2] = -1;
		return 0;
	}
}

function comparerSurfaceCellules(c1,c2)
{
	if(tableauModif[c1] == tableauModif[c2]) return true;
	else return false;
}

function SupprimerMur(cellule,facade)
{
	if (facade == "right") document.getElementById(cellule).style.borderRight = "0px";
	if (facade == "bottom") document.getElementById(cellule).style.borderBottom = "0px";
}

function EntreeSortieAleatoire()
{
	//Le labyrinthe est composé de 4 façades (nord = 0 ,est = 1,sud = 2, ouest = 3)
	//On choisit une façade au hasard parmi les 4.
	var facadeEntree = Math.round(Math.random()*3);

	switch (facadeEntree) 
	{
		case 0 : entree = Math.round(Math.random()*(n-1));
				 sortie = Math.round((tailleLaby-1) - Math.random()*(n-1));
		break;
		case 1 : entree = Math.round(Math.random()*(m-1))*n+(n-1);
				 sortie = Math.round(Math.random()*(m-1))*n	;
		break;
		case 2 : entree = Math.round((tailleLaby-1) - Math.random()*(n-1));
				 sortie = Math.round(Math.random()*(n-1));
		break;
		case 3 : entree = Math.round(Math.random()*(m-1))*n;
				 sortie = Math.round(Math.random()*(m-1))*n + (n-1);
		break;
	}
	
	curseur = entree;
	quete = sortie;
	document.getElementById(entree).innerHTML = "<img src='you.png' alt='you' title='You' class='indi'/> ";
	document.getElementById(sortie).innerHTML = "<img src='graal.png' alt='quest' title='Holy Graal' class='graal'/>";
}



function applyKey (_event_){
	
	// Récupère l'évement en fonction du navigateur utilisé
	var winObj = checkEventObj(_event_);
	
	var intKeyCode = winObj.keyCode;
	if(intKeyCode == 83) DeplacementPersonnage("bottom");
	if(intKeyCode == 68) DeplacementPersonnage("right");
	if(intKeyCode == 90) DeplacementPersonnage("up");
	if(intKeyCode == 81) DeplacementPersonnage("left");
	
}

function checkEventObj ( _event_ ){
	// IE explorer
	if ( window.event )
		return window.event;
	// Firefox, Safari, Chrome etc...
	else
		return _event_;
}


function DeplacementPersonnage(direction)
{
	   if (direction == "bottom" && document.getElementById(curseur+n))
	   {
	   		if (mursDispo[curseur][curseur+n] == false)
	   		{
	   		document.getElementById(curseur+n).innerHTML = "<img src='you.png' alt='you' title='You' class='indi'/> ";
	   		document.getElementById(curseur).innerHTML = "";
	   		document.getElementById(curseur).style.backgroundColor = "#963";
	   		curseur = curseur+n;
	   		}
	   }
	   if (direction == "right" && document.getElementById(curseur+1) )
	   {
	   		if(mursDispo[curseur][curseur+1] == false)
	   		{
	   		document.getElementById(curseur+1).innerHTML = "<img src='you.png' alt='you' title='You' class='indi'/> ";
	   		document.getElementById(curseur).innerHTML = "";
	   		document.getElementById(curseur).style.backgroundColor = "#963";
	   		curseur = curseur+1;
	   		}
	   }
	   if (direction == "up" && document.getElementById(curseur-n))
	   {
	   		if(mursDispo[curseur-n][curseur] == false )
	   		{
	   		document.getElementById(curseur-n).innerHTML = "<img src='you.png' alt='you' title='You' class='indi'/> ";
	   		document.getElementById(curseur).innerHTML = "";
	   		document.getElementById(curseur).style.backgroundColor = "#963";
	   		curseur = curseur-n;
	   		}
	   }
	    if (direction == "left" && document.getElementById(curseur-1))
	   {
	   		if(mursDispo[curseur-1][curseur] == false )
	   		{
	   		document.getElementById(curseur-1).innerHTML = "<img src='you.png' alt='you' title='You' class='indi'/> ";
	   		document.getElementById(curseur).innerHTML = "";
	   		document.getElementById(curseur).style.backgroundColor = "#963";
	   		curseur = curseur-1;
	   		}
	   }
	   verifierVictoire(curseur); 
}

function verifierVictoire(position)
{
	if(position == quete)
	{
		alert("victoire");
		CreerLaby();
	}
}


