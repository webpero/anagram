/* 
 * 	JavaScript for Anagram-oppgave fra Protector
 * 	05.11.2017 - Per Olav Mariussen
 */

/* 
	Funksjon for å bygge opp regulært uttryk for sjekk på fullstendige anagrammer (ikke sub-anagrammer)
	Kilde: https://naryad.wordpress.com/2011/10/08/compact-regular-expression-to-check-for-anagrams-of-a-given-string/
*/
function anagramRegexGenerator(input) {
    var lookaheadPart = '', matchingPart = '^';
    var positiveLookaheadPrefix='(?=', positiveLookaheadSuffix=')';
    var inputCharacterFrequencyMap = {}
    for ( var i = 0; i < input.length; i++ )
    {
        !inputCharacterFrequencyMap[input[i]] 
			? inputCharacterFrequencyMap[input[i]] = 1
            : ++inputCharacterFrequencyMap[input[i]];
    }
    for ( var j in inputCharacterFrequencyMap) {
        lookaheadPart += positiveLookaheadPrefix;
        for (var k = 0; k < inputCharacterFrequencyMap[j]; k++) {
            lookaheadPart += '.*';
            if (j == ' ') {
                lookaheadPart += '\\s';
            } else {
                lookaheadPart += j;
            }
            matchingPart += '.';
        }
        lookaheadPart += positiveLookaheadSuffix;
    }
    matchingPart += '$';
    return lookaheadPart + matchingPart;
}

/* Funksjon som kjører etter lasting av siden. Forutsetter at array av anagrammer finnes */
$(document).ready(function(){
	let re, 			//aktuell RegExp (i løkke, defineres her for raskere eksekvering)
		res,			//aktuelt resultat (i løkke, defineres her for raskere eksekvering)
		resultat = [],	//resultat-tabell
		html = "<ol>";	//HTML-streng som skal vises til slutt
		
	console.time("tid");	//Start timer
	
	if ( anagrammer !== undefined ) 
	{
		// Ytre løkke: Løp igjennom hele listen av anagrammer
		for ( i=0; i<anagrammer.length; i++ ) {   
			res = "";
			re = new RegExp(anagramRegexGenerator(anagrammer[i]));
			// Indre løkke: Løp igjennom resten av listen
			for ( j=i+1; j<anagrammer.length; j++ ) {	
				if ( re.test(anagrammer[j]) ) {
					res += anagrammer[j] + " ";		//Match: legg til aktuelt ord til i resultatet
				}
			}
			// Sjekk om vi fikk resultat(er) for dette ordet (anagrammer[i])
			if ( res.length > 0 ) {
				// Resultatet inneholder bare anagrammene, sett inn aktuelt ord først i resultatet
				res = anagrammer[i] + " " + res;
				// For å unngå repetiasjoner hvis det finnes tre eller flere anagrammer:
				// Sjekk om resultatet finnes i resultat-tabellen før det eventuelt legges inn i resultat-tabellen
				if ( resultat.join(' ').search(res) === -1 ) {
					resultat.push(res);		
				}
			}
		}
		// Bygg opp HTML fra resultat-tabellen
		for ( i=0; i<resultat.length; i++ ) {
			html += "<li>" + resultat[i] + "</li>";
		}
		html += "</ol>";
		// Vis HTML
		$("#anagram-liste").html(html);
	} 
	else 
	{
		console.log("Error: anagram-liste udefinert");
	}
	
	console.timeEnd("tid");		//Stopp timer og vis påløpt tid
});