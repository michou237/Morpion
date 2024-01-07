$(document).ready(function () {
    // Variables
    var currentPlayer = 1; // 1 pour le joueur 1, 2 pour le joueur 2
    var board = $('#board');

    // Générer la grille
    generateBoard();

    // Gestion du clic sur une case
    board.on('click', 'img', function () {
        var cell = $(this);

        // Vérifier si la case est vide
        if (cell.attr('src') == 'vide.png') {
            // Ajouter la croix ou le cercle en fonction du joueur
            if (currentPlayer === 1) {
                cell.attr('src', "croix.png");
            } else {
                cell.attr('src', "cercle.png");
            }

            // Changer de joueur pour le prochain coup
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            // Vérifier s'il y a un gagnant
            /*if (checkWinner()) {
                alert("Joueur " + (currentPlayer === 1 ? "2" : "1") + " a gagné !");
                resetBoard();
            }*/
			if (checkWinner()) {
                alert("Joueur " + (currentPlayer === 2 ? "2" : "1") + " a gagné !");
                resetBoard();
            } 
			else {
                // Si le joueur suivant est l'IA, laissez-le jouer
                if (currentPlayer === 2) {
                    playAI();
                }
            }
        }
    });

    // Gestion du clic sur le bouton de réinitialisation
    $('#reset').click(function () {
        resetBoard();
    });

    // Fonction pour générer la grille
    function generateBoard() {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                board.append('<img>');
            }
        }
        board.find('img').attr('src', "vide.png"); // Vider les images
    }

    // Fonction pour réinitialiser la grille
    function resetBoard() {
        board.find('img').attr('src', "vide.png"); // Vider les images
        currentPlayer = 1; // Réinitialiser le joueur à 1
    }

    // Fonction pour que l'IA joue
    function playAI() {
        var bestScore = -Infinity;
        var bestMove;

        // Parcourir toutes les cellules pour simuler les coups possibles
        board.find('img').each(function () {
            var cell = $(this);

            // Vérifier si la cellule est vide
            if (cell.attr('src') == 'vide.png') {
                // Simuler le coup de l'IA
                cell.attr('src', 'cercle.png');

                // Calculer le score pour ce coup
                var score = minimax(board, 0, false);

                // Annuler le coup de l'IA
                cell.attr('src', "vide.png");

                // Mettre à jour le meilleur coup
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = cell;
                }
            }
        });

        // Appliquer le meilleur coup de l'IA
        bestMove.attr('src', 'cercle.png');

        // Changer de joueur pour le prochain coup
        currentPlayer = 1;
    }

    // Fonction de minimax pour évaluer les coups
    function minimax(board, depth, isMaximizing) {
        // Vérifier s'il y a un gagnant à cette profondeur
        if (checkWinner()) {
            return isMaximizing ? -1 : 1;
        }

        // Vérifier s'il y a match nul
        if (checkTie()) {
            return 0;
        }

        // Initialiser le meilleur score en fonction du joueur
        var bestScore = isMaximizing ? -Infinity : Infinity;

        // Parcourir toutes les cellules pour simuler les coups possibles
        board.find('img').each(function () {
            var cell = $(this);

            // Vérifier si la cellule est vide
            if (cell.attr('src') == 'vide.png') {
                // Simuler le coup du joueur
                var symbol = isMaximizing ? 'cercle.png' : 'croix.png';
                cell.attr('src', symbol);

                // Calculer le score pour ce coup
                var score = minimax(board, depth + 1, !isMaximizing);

                // Annuler le coup du joueur
                cell.attr('src', 'vide.png');

                // Mettre à jour le meilleur score
                if (isMaximizing) {
                    bestScore = Math.max(score, bestScore);
                } else {
                    bestScore = Math.min(score, bestScore);
                }
            }
        });

        return bestScore;
    }

    // Fonction pour vérifier s'il y a un gagnant
    function checkWinner() {
        // Vérification des lignes, colonnes et diagonales
        if (
            checkLine(0, 1, 2) || checkLine(3, 4, 5) || checkLine(6, 7, 8) || // lignes
            checkLine(0, 3, 6) || checkLine(1, 4, 7) || checkLine(2, 5, 8) || // colonnes
            checkLine(0, 4, 8) || checkLine(2, 4, 6) // diagonales
        ) {
			
			var winnerMessage = currentPlayer === 1 ? 'Joueur 1 a gagné !' : 'Joueur 2 a gagné !';
			$('#winner-message').textContent = winnerMessage;
            return true;
        }

        return false;
    }

    // Fonction pour vérifier une ligne
    function checkLine(a, b, c) {
        var cells = board.find('img');
        return (
            cells.eq(a).attr('src') === cells.eq(b).attr('src') &&
            cells.eq(b).attr('src') === cells.eq(c).attr('src') &&
            cells.eq(a).attr('src') !== 'vide.png'
        );
    }

    // Fonction pour vérifier l'égalité
    function checkTie() {
        var cells = board.find('img');
        for (var i = 0; i < cells.length; i++) {
            if (cells.eq(i).attr('src') === 'vide.png') {
                return false; // Il y a encore une case vide, le jeu continue
            }
        }
        return true; // Toutes les cases sont remplies, c'est un match nul
    }
});
