const inputBox = document.getElementById('inputBox');
const submitButton = document.getElementById('submitButton');
const resultText = document.getElementById('resultText');

computeRequiredFuel = (mass) => {
    let result = Math.floor(mass / 3) - 2;

    if (mass <= 0 || result <= 0) {
        return 0;
    }

    return result + computeRequiredFuel(result);
};

submitButton.addEventListener("click", () => {
    let input = inputBox.value;
    let moduleMasses = input.toString().split("\n");

    let i, fuelSum = 0;
    for (i = 0; i < moduleMasses.length; i++) {
        fuelSum += computeRequiredFuel(moduleMasses[i]);
    }

    resultText.innerHTML = fuelSum;
});

/* INPUT

113045
63499
117820
67582
100343
132920
122289
142311
51373
142364
121174
90330
111284
82104
79008
141202
138923
100852
56219
72879
101983
78405
139516
112582
84889
131671
137836
88443
79239
70567
112671
63253
139851
100280
62443
109478
116067
94324
107225
53355
63022
102727
66149
111880
114110
77370
98892
120981
149730
84149
103898
145915
132071
73244
58793
130003
127716
114590
127568
68300
103464
97757
89432
145750
132882
92343
106288
101093
76813
66761
100011
128436
117810
146648
63211
107305
111933
137197
54156
122614
129652
141407
99562
50643
57059
134789
140015
112419
117933
139452
138977
137325
113279
111160
145219
107037
97361
72949
52997
121614

*/