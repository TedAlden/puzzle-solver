import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./PyramidPiecePreview.css";

/**
 * A component that renders a 3D preview of a polysphere piece using Three.js.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.selectedShape The currently selected shape piece.
 * @returns {JSX.Element}
 */
const PiecePreview3D = ({ selectedShape }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x374151);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update piece visualisation when selectedShape changes
  useEffect(() => {
    if (!selectedShape || !sceneRef.current) return;

    // Clear existing meshes
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // Create spheres
    const SPHERE_SIZE = 0.48;
    const SPACING = 0.90;  
    const sphereGeometry = new THREE.SphereGeometry(SPHERE_SIZE, 40, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ 
      color: selectedShape.colour
    });

    selectedShape.coords.forEach(([x, y, z=0]) => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // Apply tighter spacing
      sphere.position.set(
        x * SPACING, 
        z * SPACING, 
        y * SPACING
      );
      sceneRef.current.add(sphere);
    });

    // Add coordinate axes helper
    const axesHelper = new THREE.AxesHelper(2);
    sceneRef.current.add(axesHelper);
  }, [selectedShape]);

  return (
    <div ref={mountRef} className="mx-auto border rounded-lg overflow-hidden" />
  );
};
/**
 * A component for selecting and transforming polysphere pieces. Allows
 * users to navigate through a carousel of unused shapes, and flip or rotate
 * the selected shape.
 *
 * @param {Object} props Component properties
 * @param {Object} props.selectedShape The currently selected shape piece
 * @param {Function} props.onFlipX Function to flip the selected shape
 * @param {Function} props.onFlipY Function to flip the selected shape
 * @param {Function} props.onFlipZ Function to flip the selected shape
 * @param {Function} props.onRotateX Function to rotate the selected shape
 * @param {Function} props.onRotateY Function to rotate the selected shape
 * @param {Function} props.onRotateZ Function to rotate the selected shape
 * @param {Function} props.onPrevious Function to select the previous shape
 * @param {Function} props.onNext Function to select the next shape
 * @returns {JSX.Element}
 */
const PieceSelector3D = ({
  selectedShape,
  onFlipX,
  onFlipY,
  onFlipZ,
  onRotateX,
  onRotateY,
  onRotateZ,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="pieceSelector3D">
      <div className="nav-controls">
        <button onClick={onPrevious}>Prev</button>
        <button onClick={onNext}>Next</button>
      </div>
      
      <div className="preview-section">
        <div className="flip-controls">
          <button onClick={onFlipX}>Flip X</button>
          <button onClick={onFlipY}>Flip Y</button>
          <button onClick={onFlipZ}>Flip Z</button>
        </div>

        <div className="preview-container">
          <PiecePreview3D selectedShape={selectedShape} />
        </div>

        <div className="rotate-controls">
          <button onClick={onRotateX}>Rotate X</button>
          <button onClick={onRotateY}>Rotate Y</button>
          <button onClick={onRotateZ}>Rotate Z</button>
        </div>
      </div>
    </div>
  );
};
export default PieceSelector3D;
