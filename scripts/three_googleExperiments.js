function init() {

        var container = document.getElementById('map-div');

        var map = new google.maps.Map(container, {
          zoom: 3,
          mapTypeControl: true,
          center: new google.maps.LatLng(10, 0),
          mapTypeId: google.maps.MapTypeId.HYBRID,
          styles: styles
        });

        // if you add renderertype:'Canvas' to the options for ThreejsLayer, you can force the usage of CanvasRenderer
        new ThreejsLayer({ map: map }, function(layer){

          if (layer.renderertype=='Canvas' || !Detector.webgl) {
            texture = new THREE.Texture(generateSprite());
            particles = new THREE.Object3D();
            material = new THREE.SpriteMaterial({
              size: 20,
              map: texture,
              opacity: 1,
              blending: THREE.NormalBlending,
              depthTest: false,
              transparent: true
            });


            photos.forEach(function (photo) {
              var particle = new THREE.Sprite(material);
              var location = new google.maps.LatLng(photo[0], photo[1]),
                vertex = layer.fromLatLngToVertex(location);

              particle.position.set(vertex.x, vertex.y, 0);
              particle.scale.x = particle.scale.y = 20;
              particles.add(particle);
              material.size = 20;
            });
          } else {
            var geometry = new THREE.Geometry(),
              texture = new THREE.Texture(generateSprite()),
              material, particles;

            photos.forEach(function(photo){
              var location = new google.maps.LatLng(photo[0], photo[1]),
                vertex = layer.fromLatLngToVertex(location);

              geometry.vertices.push( vertex );
            });

            texture.needsUpdate = true;

            material = new THREE.PointsMaterial({
              size: 10,
              map: texture,
              opacity: 0.35,
              blending: THREE.AdditiveBlending,
              depthTest: false,
              transparent: true
            });

            particles = new THREE.Points( geometry, material );
          }
          layer.add( particles );

          gui = new dat.GUI();

          function update(){
            if (layer.renderertype=='Canvas' || !Detector.webgl)  material.map = new THREE.Texture(generateSprite(material.size));
            layer.render();
          }

          gui.add(material, 'size', 2, 100).onChange(update);
          gui.add(material, 'opacity', 0.1, 1).onChange(update);

        });
      }

      function generateSprite(size) {

        var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          gradient;
        size = size || 20;
        canvas.width = size;
        canvas.height = size;

        gradient = context.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );

        gradient.addColorStop(1.0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.0, 'rgba(255,255,255,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
      }

      document.addEventListener('DOMContentLoaded', init, false);