// Three.js 3D Background Scene
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    // Camera position
    camera.position.z = 5;

    // Create floating geometric shapes
    const shapes = [];
    const shapeCount = 15;

    // Geometry types
    const geometries = [
        () => new THREE.BoxGeometry(0.5, 0.5, 0.5),
        () => new THREE.IcosahedronGeometry(0.3, 0),
        () => new THREE.OctahedronGeometry(0.3, 0),
        () => new THREE.TetrahedronGeometry(0.3, 0),
        () => new THREE.TorusGeometry(0.2, 0.1, 8, 16),
        () => new THREE.SphereGeometry(0.2, 16, 16)
    ];

    // Create shapes with different materials
    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)]();
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(
                (Math.random() * 0.1 + 0.5), // Hue between 0.5-0.6 (purple/blue range)
                0.7, // Saturation
                0.5 + Math.random() * 0.3 // Lightness
            ),
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.4 + Math.random() * 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Store rotation speeds
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            initialPosition: {
                x: mesh.position.x,
                y: mesh.position.y,
                z: mesh.position.z
            }
        };

        scene.add(mesh);
        shapes.push(mesh);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional lights
    const light1 = new THREE.DirectionalLight(0x667eea, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x764ba2, 0.8);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // Add point lights for more dynamic lighting
    const pointLight1 = new THREE.PointLight(0x4f46e5, 0.5, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 10);
    pointLight2.position.set(-3, -3, -3);
    scene.add(pointLight2);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        targetRotation.x = mouse.y * 0.5;
        targetRotation.y = mouse.x * 0.5;
    });

    // Scroll interaction
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera rotation based on mouse
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
        
        camera.rotation.x = currentRotation.x;
        camera.rotation.y = currentRotation.y;

        // Update camera position based on scroll
        camera.position.z = 5 + scrollY * 0.001;

        // Animate shapes
        shapes.forEach((shape, index) => {
            // Rotate shapes
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Float animation
            const time = Date.now() * 0.001;
            shape.position.x = shape.userData.initialPosition.x + Math.sin(time + index) * 0.5;
            shape.position.y = shape.userData.initialPosition.y + Math.cos(time + index) * 0.5;
            shape.position.z = shape.userData.initialPosition.z + Math.sin(time * 0.5 + index) * 0.3;

            // Pulsing opacity
            shape.material.opacity = 0.4 + Math.sin(time * 2 + index) * 0.2;
        });

        // Animate point lights
        const time = Date.now() * 0.001;
        pointLight1.position.x = 3 + Math.sin(time) * 2;
        pointLight1.position.y = 3 + Math.cos(time) * 2;
        
        pointLight2.position.x = -3 + Math.cos(time) * 2;
        pointLight2.position.y = -3 + Math.sin(time) * 2;

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();
});

