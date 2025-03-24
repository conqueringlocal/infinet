
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Fiber3DModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    
    // Clear previous canvas
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    mountRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create fiber cable
    const createFiberCable = () => {
      const group = new THREE.Group();

      // Outer casing
      const outerGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
      const outerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        transparent: true,
        opacity: 0.7
      });
      const outerCylinder = new THREE.Mesh(outerGeometry, outerMaterial);
      group.add(outerCylinder);

      // Inner tubes
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 / 7) * i;
        const radius = 0.5;
        
        const tubeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 10, 16);
        const tubeMaterial = new THREE.MeshPhongMaterial({ 
          color: colors[i % colors.length],
          emissive: colors[i % colors.length],
          emissiveIntensity: 0.2
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.position.x = Math.cos(angle) * radius;
        tube.position.z = Math.sin(angle) * radius;
        
        group.add(tube);
      }

      // Light passing through fiber
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 / 7) * i;
        const radius = 0.5;
        
        const lightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
          color: colors[i % colors.length]
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.x = Math.cos(angle) * radius;
        light.position.z = Math.sin(angle) * radius;
        light.position.y = -4; // Start at one end
        
        // Animation data
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = 0.05 + Math.random() * 0.1;
        light.userData = { direction, speed, originalY: light.position.y };
        
        group.add(light);
      }

      group.rotation.x = Math.PI / 2; // Lay horizontally
      return group;
    };

    const fiberCable = createFiberCable();
    scene.add(fiberCable);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate light particles
      fiberCable.children.forEach(child => {
        if (child.geometry.type === 'SphereGeometry') {
          const { direction, speed, originalY } = child.userData;
          child.position.y += direction * speed;
          
          // Reset position when it reaches the end
          if (child.position.y > 5 || child.position.y < -5) {
            child.position.y = originalY;
          }
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
    />
  );
};

export default Fiber3DModel;
