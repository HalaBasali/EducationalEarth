
// Erstellen eines WebGL Kontextes
function initWebGL(canvas) {

	var gl = null;
	var msg = "Ihr Browser unterstützt WebGL nicht," + "oder es ist nicht standardmäßig aktiviert."

	try {
		gl = canvas.getContext("experimental-webgl");
	} catch(e) {
		msg = "Fehler beim Erstellen eines WebGL Kontextes!: " + e.toString();
	}

	if(!gl) {
		alert(msg);
		throw new Error(msg);
	}

	return gl;
}

// Erstellen des Viewports (= Rechteck, in das gezeichnet wird)
function initViewport(gl, canvas) {
	gl.viewport(0, 0, canvas.width, canvas.height);
}

// Matrix, die der Shader benötigt, um die 3D-Koordinaten des Models im Kamera-Raum in 
// 2D-Koordinaten im Viewport-Raum zu konvertieren.
var projectionMatrix;

// Matrix, die die Position des Objekts im dreidimensionalen Koordinatensystem in Abhängigkeit 
// von der Kamera definiert (Transformation des Models und der Kamera).
var modelViewMatrix;

var rotationAxis;

// mat4 ist ein Matrizentyp der glMatrix Bibliothek
function initMatrices(canvas){
	// Erstellen einer ModelViewMatrix mit einer Kamera bei 0, 0, -8
	modelViewMatrix = mat4.create();
	mat4.translate(modelViewMatrix,modelViewMatrix, [0, 0, -8]);

	// Erstellen einer ProjectionMatrix in der 45° Sehfeld
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
	
	rotationAxis = vec3.create();
	vec3.normalize(rotationAxis, [1, 1, 1]);
}

// Erstellen des Vertex, der Farbe und der Index Daten für einen mehrfarbigen Würfel
function createCube(gl) {
  var vertexBuffer;
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var verts = [
    // Vorderseite
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Rückseite
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

     // Oberseite
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Unterseite
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Rechte Seite
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

     // Linke Seite
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  var textureCoords = [

    // Vorderseite
    0.0, 0.0, 
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Rückseite
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Oberseite
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Unterseite
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,

    // Rechte Seite
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Linke Seite
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

  // Index Buffer zur Definition der zu erstellenden Dreiecke
  var cubeIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
  var cubeIndices = [
    0,  1,  2,     0,  2,  3, // Vorderseite
    4,  5,  6,     4,  6,  7, // Rückseite
    8,  9, 10,     8, 10, 11, // Oberseite
    12, 13, 14,   12, 14, 15, // Unterseite
    16, 17, 18,   16, 18, 19, // Rechte Seite
    20, 21, 22,   20, 22, 23  // Linke Seite
  ]

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

  var cube = {buffer: vertexBuffer, texCoordBuffer: texCoordBuffer, indices:cubeIndexBuffer,
        vertSize:3, nVerts:24, texCoordSize:2, ntexCoords:24, nIndices:36, primtype:gl.TRIANGLES};

  return cube;
}

/* Shader werden normalerweise in GLSL geschrieben; Ein Shader definiert, wie die Pixel der 
   3D Objekte tatsächlich gezeichnet werden.WebGL erwartet für jedes zu zeichnende Objekt
 	einen Shader. Man kann auch denselben für mehrere Objekte verwenden, in dem man jeweils 
	unterschiedliche Parameterwerte eingibt.
	VertexShader: 	Transformiert die Objektkoordinaten in 2D
	FragmentShader: Generiert die finale Farbe für jeden Pixel (Farbe, Textur, Licht, Material)
*/
function createShader(gl, str, type) {
	var shader;
	if(type == "fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if(type == "vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

// Vertex Shader Code in einer globalen String-Variablen verpackt
var vertexShaderSource =
	" 	attribute vec3 vertexPos;\n" +
	" 	attribute vec2 texCoord;\n" +
	" 	uniform mat4 modelViewMatrix;\n" +
	" 	uniform mat4 projectionMatrix;\n" +
	" 	varying vec2 vTexCoord;\n" +
	" 	void main(void) {\n" +
	" 		// Gibt den transformierten und projizierten Vertex Wert zurück\n" +
	" 		gl_Position =	projectionMatrix * modelViewMatrix * \n" +
	" 						vec4(vertexPos, 1.0);\n" +
	"		// Ausgabe der Texturkoordinate in vTexCoord\n" +
	" 		vTexCoord = texCoord;\n" +
	" 	}\n";

// Fragment Shader Code in einer globalen String-Variablen verpackt
var fragmentShaderSource =
	"	precision mediump float;\n" +
	" 	varying vec2 vTexCoord;\n" +
	"	uniform sampler2D uSampler;\n" +
	" 	void main(void) {\n" +
	" 	// Gibt die Pixelfarbe zurück: hier immer die Farbe Weiß\n" +
	" 	gl_FragColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));\n" +
	" 	}\n";

var shaderProgram;
var shaderVertexPositionAttribute;
var shaderVertexColorAttribute;
var shaderProjectionMatrixUniform;
var shaderModelViewMatrixUniform;
var shaderSamplerUniform;

function initShader(gl) {
	// Laden und Compilieren des Fragment Shaders und des Vertex Shaders
	var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
	var vertexShader = createShader(gl, vertexShaderSource, "vertex");

	// Beide in ein neues Programm laden
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// Zeiger für die Shader Parameter holen
	shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
	gl.enableVertexAttribArray(shaderVertexPositionAttribute);

	shaderTexCoordAttribute = gl.getAttribLocation(shaderProgram, "texCoord");
	gl.enableVertexAttribArray(shaderTexCoordAttribute);

	shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
	shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
	shaderSamplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Shader konnte nicht initialisiert werden!");
	}
}

// Textur laden und auf den Würfel legen
var okToRun = false;

// Callback Methode für das onload Event
function handleTextureLoaded(gl, texture) {
  /* Parameter Textur an WebGL binden, alle weiteren Befehle für die Textur werden so lange für die
  definierte Textur ausgeführt bis mit bindTexture() eine neue Textur geladen wird
  */
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // y-Werte umkehren, da die y-Achse in WebGL nach oben verläuft
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  // Kopieren der Bit Daten des Bildes in die WebGL Textur
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, null);
  okToRun = true;
}

var webGLTexture;

function initTexture(gl) {
  // Erzeugen eines WebGL TexturObjekts
  webGLTexture = gl.createTexture();
  // Dem Image Attribut der Textur ein neues Image Objekt zuweisen
  webGLTexture.image = new Image();
  // onload Handler für die Textur definieren
  webGLTexture.image.onload = function() {
    handleTextureLoaded(gl, webGLTexture);
  }
  webGLTexture.image.src = "images/webgl-logo-256.jpg";
}

function draw(gl, obj) {
	// Hintergrund auf schwarz setzen
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Shader setzen
	gl.useProgram(shaderProgram);

	// Vertex Buffer anbinden
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
	// Shader Parameter verbinden: vertex position und p/mv Matrizen
	gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

	// Textur Buffer anbinden
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordBuffer);
	gl.vertexAttribPointer(shaderTexCoordAttribute, obj.texCoordSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);


	gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
	gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
	gl.uniform1i(shaderSamplerUniform, 0);

	// Zeichnen des Objekts
	gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
}

// Erstellen einer Rotation
var duration = 5000; //ms
var currentTime = Date.now();
function animate() {
	var now = Date.now();
	var deltat = now - currentTime;
	currentTime = now;
	var fract = deltat / duration;
	var angle = Math.PI * 2 * fract;
	mat4.rotate(modelViewMatrix, modelViewMatrix, angle, rotationAxis);
}

function run(gl, cube) {
	requestAnimationFrame(function() {	run(gl, cube); 	});
	if(okToRun) {
		draw(gl, cube);
		animate();
	}
}

$(document).ready(
		function() {
			var canvas = document.getElementById("webglcanvas");
			var gl = initWebGL(canvas);
			initViewport(gl, canvas);
			initMatrices(canvas);
			var cube = createCube(gl);
			initShader(gl);
			initTexture(gl);
			run(gl,cube);
		}
);
