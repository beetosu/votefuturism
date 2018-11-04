//made by beetosu during a hackathon
//i made most of the jokes in this while very, very sleep deprived, so apologizes in advance if they're bad/in poor taste, my b

//makes sure the form in index.html is valid
function checkInputs() {
    var z, y, st, result;

    z = parseInt(document.getElementById("zip").value);
    y = parseInt(document.getElementById("year").value);
    st = document.getElementById("state").value

    if (isNaN(z + y)) {
        result = "invalid input!"
    }
    else {
        if (y < 2020) {
            result = "year too early!"
        }
        else if (z < 9999 || z > 99999) {
            result = "invalid zip code!"
        }
        else {
            result = "loading..."
            window.location.href = "ballot.html?zip=" + z.toString() + "&year=" + y.toString() + "&state=" + st;
        }
    }

    document.getElementById("error").innerHTML = result;
} 

function configure() {
    //gets the params of the ballot.html url
    var page = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + "/" + window.location.search;
    var url = new URL(page);

    var state = url.searchParams.get("state");
    var year = url.searchParams.get("year");
    var zip = url.searchParams.get("zip");

    //calls getBallot, and puts it into the body through the 'meme' div
    var ballot = getBallot(year, state);
    document.getElementById("confirmation").innerHTML = ballot;
}

function getBallot(yr, st) {
    var ballotHTML = "";
    var era = 0;
    var cap = 5;
    var currentPeople = [];
    var currentProps = [];

    if (yr % 4 == 0) {
        ballotHTML += "<div class=title><b>PRESIDENTIAL ELECTION</b></div>"
    }
    else if (yr % 2 == 0) {
        ballotHTML += "<div class=title><b>MIDTERM ELECTION</b></div>"
    }
    else {
        ballotHTML += "<div class=title><b>ELECTION</b></div>"
    }

    ballotHTML += "<div class=subtitle><b>" + st + ", " + String(yr) + " A.D.</b></div><br>"

    //figures out what era dictionary to use based of the year inputed
    for (var i = 0; i < Object.keys(people).length; i++) {
        if (people[i].max >= yr && people[i].min < yr) {
                era = i;
        }
    }

    //gets what the cap should be by saving space for required positions
    for (var x = 0; x < people[era].positions.length; x++) {
        if (yr % people[era].positions[x].term == 0) {
            cap -= 1;
        }
    }

    for (var s = 0; s < people[era].names.length; s++) {
        currentPeople.push(s);
    }

    for (var t = 0; t < people[era].positions.length; t++) {
        //raffles of the extra possible space to the rest of the possible positions
        if (people[era].positions[t].term == 0 && cap > 0) {
            if (Math.random() >= .85) {
                people[era].positions[t].term = 1;
                cap -= 1;
            }
        } 

        //writes the data like this: position: person (party 1), person (party 2), etc.
        //every party past the second one is left up to chance in terms of inclusion
        if (yr % people[era].positions[t].term == 0) {
            ballotHTML += "<div class = header-" + people[era].positions[t].size + "><b>" + people[era].positions[t].name + "</b></div><div>"
            for (var p = 0; p < people[era].parties.length; p++) {
                if ((p <= 1 || (p == 2 && Math.random() >= .5) || Math.random() >= .7)) {
                    if (currentPeople.length > 0) {
                        randomPeopleIndex = Math.floor(Math.random() * (currentPeople.length))
                        currentName = people[era].names[currentPeople[randomPeopleIndex]];
                        currentPeople.splice(randomPeopleIndex, 1);
                    }
                    else {
                        currentName = "NO MORE NAMES"
                    }
                    ballotHTML += "<div class = entry-" + people[era].positions[t].size + ">" + currentName + " (" + people[era].parties[p] + ")</div>";
                }
            }
            ballotHTML += "</div><br>"
        }
    }

    //writes the propositions like this: prop: prop1, prop2, etc.
    ballotHTML += "<br><div class= prop-header><b>Propositions</b></div><div>"

    for (var q = 0; q < people[era].propositions.length; q++) {
        currentProps.push(q);
    }
    //after this currentProps == [0, 1, 2, 3, 4, 5, etc.]

    //people[era].propositions[Math.floor(Math.random()*people[era].propositions.length)] = random prop from string
    //(Math.floor(Math.random() * (5) + 1)) = random number from 1-4

    var propNum = 0;

    if (people[era].propositions.length < 5) {
        propNum = (Math.floor(Math.random() * (people[era].propositions.length) + 1))
    }
    else {
        propNum = (Math.floor(Math.random() * (6) + 1))
    }

    for (var z = 0; z < propNum; z++) {
        if (currentProps.length > 0) {
            randomPropIndex = Math.floor(Math.random() * (currentProps.length))
            ballotHTML += "<div class = prop-entry>" + people[era].propositions[currentProps[randomPropIndex]] + "</div>"
            currentProps.splice(randomPropIndex, 1);
        }
        else {
            ballotHTML = "<div class = prop-entry>NO MORE PROPS</div>"
        }
    }

    return ballotHTML;
}

var people = [
    {min: -1000,
    max: -1,
    parties: [],
    positions: [{name: "", size: "", term: 4}],
    names: [],
    propositions: []},
    
    //mostly now, but weird.
    {min: 0,
    max: 9999,
    parties: ["Democrat", "Republican", "Libertarian", "Green"],
    positions: [{name: "President", size: "large", term: 4}, {name: "Vice President", size: "medium", term: 4}, {name: "Governor", size: "medium", term: 0}, {name: "Senator", size: "medium", term: 0}, {name: "Represenative", size: "medium", term: 2}, {name: "Lt. Governor", size: "medium", term: 0}, {name: "Attorney General", size: "medium", term: 0}, {name: "Mayor", size: "medium", term: 0}, {name: "State Senator", size: "small", term: 0}, {name: "State Assembly", size: "small", term: 0}],
    names: ["Rund Paul", "Chaz Bluetooth", "A.I. Shakespeare", 'The Blue Guy from "Avatar"', "The version of Robert Frost\nI see during sleep paralysis", "Cybernetic Philip K. Dick", "A bunch of protestic arms", "George H. WWW.Bush.com", "Donald Trump, IV", "Cyborg Ronald Reagan Mk. 3", "Calvin Hobbes", "Oswald, the Fire Safety Pidgeon", "Animatronic Abe Lincoln", "Siri", '"Barack Obama"', "Ted Cruz", "You, but Worse", "Mark Hubert", "Boris Jefferson", "Franz Fillman", "Alberto Fish", "Homunculus", "A Human Shaped Dog", "A Shifty Man in a Trenchcoat", "Harold Fritz", "Jeff Glitzberg", "Monopoly Man when he was<br>youthful and full of hope"],
    propositions: ["Demilitarize crime-smelling dogs", "Make everyone pretend to be friends with the Vice President", "Remake Breakfast at Tiffany's without the rascism", "Bar cats from voting", "Manditory 3rd lung transplant", "Communism but with more odds n' ends", "Make everyone fight a cybernetic clone of themselves.", "Allow dogs to vote", "Euthanize all fish", "Build more boats", "Recriminialize juuling", "ASMR fireside chats", "Bodycams for mailmen", "Give the president a bar mitzvah"]},
    
    //nothing
    {min: 9999,
    max: Infinity,
    parties: ["[UNKNOWN]"],
    positions: [{name: "BEING OF ALL SENTIENCE", size: "massive", term: 1}],
    names: ["THE ORB"],
    propositions: ["BECOME ABSORBED"]}
]