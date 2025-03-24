
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ModelState {
  rotationSpeed: number;
  lightSpeed: number;
  showInnerFibers: boolean;
  showLightParticles: boolean;
}

const Fiber3DModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [modelState, setModelState] = useState<ModelState>({
    rotationSpeed: 0.001,
    lightSpeed: 0.05,
    showInnerFibers: true,
    showLightParticles: true
  });
  const fiberCableRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Handle state changes
  const handleSpeedChange = (value: number) => {
    setModelState(prev => ({ ...prev, rotationSpeed: value }));
  };

  const handleLightSpeedChange = (value: number) => {
    setModelState(prev => ({ ...prev, lightSpeed: value }));
  };

  const toggleInnerFibers = () => {
    setModelState(prev => ({ ...prev, showInnerFibers: !prev.showInnerFibers }));
  };

  const toggleLightParticles = () => {
    setModelState(prev => ({ ...prev, showLightParticles: !prev.showLightParticles }));
  };

  // Reset camera position
  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 15);
      controlsRef.current.reset();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f5);

    // Create a grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x999999);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -5;
    scene.add(gridHelper);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Clear previous canvas
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    mountRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
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
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Add a directional light for better shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-5, 5, 8);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create fiber cable
    const createFiberCable = () => {
      const group = new THREE.Group();

      // Outer casing
      const outerGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
      const outerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        transparent: true,
        opacity: 0.7,
        shininess: 100
      });
      const outerCylinder = new THREE.Mesh(outerGeometry, outerMaterial);
      outerCylinder.castShadow = true;
      outerCylinder.receiveShadow = true;
      group.add(outerCylinder);

      // Middle protective layer
      const middleGeometry = new THREE.CylinderGeometry(0.85, 0.85, 10, 32);
      const middleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x888888,
        transparent: true,
        opacity: 0.8
      });
      const middleCylinder = new THREE.Mesh(middleGeometry, middleMaterial);
      group.add(middleCylinder);

      // Inner tubes
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
      const innerTubes: THREE.Mesh[] = [];
      
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 / 7) * i;
        const radius = 0.5;
        
        const tubeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 10, 16);
        const tubeMaterial = new THREE.MeshPhongMaterial({ 
          color: colors[i % colors.length],
          emissive: colors[i % colors.length],
          emissiveIntensity: 0.2,
          shininess: 100
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.position.x = Math.cos(angle) * radius;
        tube.position.z = Math.sin(angle) * radius;
        tube.userData = { isFiber: true };
        
        innerTubes.push(tube);
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
        light.userData = { isLightParticle: true };
        
        // Animation data
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = 0.05 + Math.random() * 0.1;
        light.userData = { ...light.userData, direction, speed, originalY: light.position.y };
        
        group.add(light);
      }

      // Add a central core fiber
      const coreGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5,
        shininess: 150
      });
      
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.userData = { isFiber: true };
      group.add(core);

      group.rotation.x = Math.PI / 2; // Lay horizontally
      return group;
    };

    const fiberCable = createFiberCable();
    fiberCableRef.current = fiberCable;
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
      
      if (fiberCableRef.current) {
        // Auto rotation based on current speed setting
        fiberCableRef.current.rotation.z += modelState.rotationSpeed;
        
        // Toggle visibility of inner fibers
        fiberCableRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.userData.isFiber) {
              child.visible = modelState.showInnerFibers;
            }
            if (child.userData.isLightParticle) {
              // Update light particle movement
              child.visible = modelState.showLightParticles;
              if (modelState.showLightParticles) {
                const { direction, originalY } = child.userData;
                child.position.y += direction * modelState.lightSpeed;
                
                // Reset position when it reaches the end
                if (child.position.y > 5 || child.position.y < -5) {
                  child.position.y = originalY;
                }
              }
            }
          }
        });
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose resources
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update the animation when model state changes
  useEffect(() => {
    // No need to do anything here as the animation loop reads from modelState
  }, [modelState]);

  return (
    <div className="w-full space-y-4">
      <div 
        ref={mountRef} 
        className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-black/5 dark:bg-white/5"
      />
      
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Rotation Speed</label>
          <input 
            type="range" 
            min="0" 
            max="0.02" 
            step="0.001" 
            value={modelState.rotationSpeed} 
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Light Speed</label>
          <input 
            type="range" 
            min="0.01" 
            max="0.2" 
            step="0.01" 
            value={modelState.lightSpeed} 
            onChange={(e) => handleLightSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={toggleInnerFibers}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${modelState.showInnerFibers 
              ? 'bg-infinet-100 text-infinet-800' 
              : 'bg-gray-100 text-gray-500'}`}
          >
            {modelState.showInnerFibers ? 'Hide Fibers' : 'Show Fibers'}
          </button>
          
          <button 
            onClick={toggleLightParticles}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${modelState.showLightParticles 
              ? 'bg-infinet-100 text-infinet-800' 
              : 'bg-gray-100 text-gray-500'}`}
          >
            {modelState.showLightParticles ? 'Hide Light' : 'Show Light'}
          </button>
          
          <button 
            onClick={resetCamera}
            className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fiber3DModel;
