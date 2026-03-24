/**
 * AvatarCard.jsx — Reusable Avatar Card Component
 * भारत Avatar Platform — India Innovates 2026
 */

import React from 'react';

function AvatarCard({ avatar, onClick }) {
  return (
    <div
      id={`avatar-card-${avatar.id}`}
      onClick={() => onClick && onClick(avatar)}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
                 transform hover:scale-105 transition-all duration-300 ease-out bg-white border border-gray-100"
    >
      {/* Colored header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ backgroundColor: avatar.color }}
      >
        <span className="text-4xl">{avatar.emoji}</span>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg leading-tight">{avatar.name}</h3>
          <p className="text-white/80 text-sm">{avatar.region}</p>
        </div>
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {avatar.lang_label}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4" style={{ backgroundColor: avatar.bg_color + '40' }}>
        {/* Title */}
        <p className="text-gray-700 font-medium text-sm mb-3">{avatar.title}</p>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {avatar.topics.slice(0, 4).map((topic, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{
                color: avatar.color,
                borderColor: avatar.color + '60',
                backgroundColor: avatar.color + '10',
              }}
            >
              {topic}
            </span>
          ))}
          {avatar.topics.length > 4 && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ color: avatar.color + '90' }}
            >
              +{avatar.topics.length - 4} more
            </span>
          )}
        </div>

        {/* Greeting preview */}
        <p
          className="text-sm italic line-clamp-2 leading-relaxed"
          style={{ color: avatar.color + 'cc' }}
        >
          "{avatar.greeting}"
        </p>
      </div>
    </div>
  );
}

export default AvatarCard;
