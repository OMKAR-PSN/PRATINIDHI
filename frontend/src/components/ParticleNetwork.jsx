import React, { useEffect, useRef } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to fill the parent container completely
    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    
    // Set initial size
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 150);
    
    // Create random particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 153, 51, 0.4)'; // Saffron tint
        ctx.fill();
        
        // Connect nearby particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distanceSq = dx * dx + dy * dy;
          
          if (distanceSq < 15000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Adjust opacity based on distance
            const opacity = 1 - Math.sqrt(distanceSq) / Math.sqrt(15000);
            
            // Subtle tricolor mix for lines
            ctx.strokeStyle = `rgba(19, 136, 8, ${opacity * 0.15})`; // Green tint
            // Mix in some white/blue
            if (i % 3 === 0) {
               ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`; 
            }
            if (i % 2 === 0) {
               ctx.strokeStyle = `rgba(255, 153, 51, ${opacity * 0.15})`; 
            }

            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
      aria-hidden="true"
    />
  );
};

export default ParticleNetwork;
