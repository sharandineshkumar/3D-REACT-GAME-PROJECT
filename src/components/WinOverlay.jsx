import React from 'react';

function WinOverlay({ level, moveCount, gameTime, onNextLevel, onReplay, hasNextLevel }) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate star rating based on moves
    const getStars = () => {
        if (moveCount <= 5) return 3;
        if (moveCount <= 10) return 2;
        return 1;
    };

    const stars = getStars();

    return (
        <div className="win-overlay">
            <div className="win-content">
                <h2 className="win-title">LEVEL COMPLETE!</h2>
                <p className="win-subtitle">Excellent work, puzzle master!</p>

                {/* Star Rating */}
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '25px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    {[1, 2, 3].map((i) => (
                        <span
                            key={i}
                            style={{
                                color: i <= stars ? '#ffaa00' : '#2d3748',
                                textShadow: i <= stars ? '0 0 20px rgba(255, 170, 0, 0.5)' : 'none',
                                transform: i <= stars ? 'scale(1)' : 'scale(0.8)',
                                transition: 'all 0.3s ease',
                                transitionDelay: `${i * 0.1}s`
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <div className="win-stats">
                    <div className="stat-item">
                        <span className="stat-value">{level}</span>
                        <span className="stat-label">LEVEL</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{moveCount}</span>
                        <span className="stat-label">MOVES</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{formatTime(gameTime)}</span>
                        <span className="stat-label">TIME</span>
                    </div>
                </div>

                <div className="win-buttons">
                    <button className="action-btn reset" onClick={onReplay}>
                        <span>↺</span>
                        REPLAY
                    </button>
                    {hasNextLevel && (
                        <button className="action-btn primary" onClick={onNextLevel}>
                            <span>→</span>
                            NEXT LEVEL
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WinOverlay;
