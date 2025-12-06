import React, { useState } from 'react';

function GameUI({
    currentLevel,
    totalLevels,
    completedLevels,
    selectedMirror,
    moveCount,
    gameTime,
    onRotateMirror,
    onMoveMirror,
    onResetLevel,
    onLevelSelect
}) {
    const [showLevelSelect, setShowLevelSelect] = useState(false);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* Header */}
            <header className="game-header">
                <h1 className="game-title">LIGHT REFLECTION</h1>

                <div className="level-indicator">
                    <span className="level-text">LEVEL</span>
                    <span className="level-number">{currentLevel}</span>
                    <span className="level-text">/ {totalLevels}</span>
                </div>
            </header>

            {/* Side Panel - Controls */}
            <div className="side-panel">
                <button
                    className="control-btn"
                    title="Reset Level"
                    onClick={onResetLevel}
                >
                    ↺
                </button>
                <button
                    className={`control-btn ${showLevelSelect ? 'active' : ''}`}
                    title="Level Select"
                    onClick={() => setShowLevelSelect(!showLevelSelect)}
                >
                    ☰
                </button>
            </div>

            {/* Level Select Panel */}
            {showLevelSelect && (
                <div className="level-select">
                    <div className="level-select-title">SELECT LEVEL</div>
                    <div className="level-grid">
                        {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => (
                            <button
                                key={level}
                                className={`level-btn ${level === currentLevel ? 'current' : ''
                                    } ${completedLevels.includes(level) ? 'completed' : ''}`}
                                onClick={() => {
                                    onLevelSelect(level);
                                    setShowLevelSelect(false);
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions Panel */}
            <div className="instructions-panel">
                <div className="instructions-title">CONTROLS</div>
                <ul className="instructions-list">
                    <li>
                        <span className="instruction-icon">🖱️</span>
                        Click mirror to select
                    </li>
                    <li>
                        <span className="instruction-icon">⬅️➡️</span>
                        Arrow keys: Move X
                    </li>
                    <li>
                        <span className="instruction-icon">⬆️⬇️</span>
                        Arrow keys: Move Z
                    </li>
                    <li>
                        <span className="instruction-icon">🔄</span>
                        Q / E: Rotate mirror
                    </li>
                    <li>
                        <span className="instruction-icon">↕️</span>
                        W / S: Move up/down
                    </li>
                    <li>
                        <span className="instruction-icon">🎯</span>
                        Guide laser to target
                    </li>
                </ul>

                <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(0, 240, 255, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }}>
                        <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>Moves:</span>
                        <span style={{
                            color: '#00f0ff',
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: '600'
                        }}>{moveCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>Time:</span>
                        <span style={{
                            color: '#00f0ff',
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: '600'
                        }}>{formatTime(gameTime)}</span>
                    </div>
                </div>
            </div>

            {/* Selected Mirror Indicator with Keyboard Hint */}
            {selectedMirror !== null && (
                <div className="selected-indicator">
                    <span className="selected-text">MIRROR {selectedMirror + 1} SELECTED</span>
                    <div className="keyboard-hint">
                        <span className="key-badge">←→↑↓</span>
                        <span className="hint-text">Move</span>
                        <span className="key-badge">Q E</span>
                        <span className="hint-text">Rotate</span>
                    </div>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="bottom-controls">
                <button className="action-btn reset" onClick={onResetLevel}>
                    <span>↺</span>
                    RESET
                </button>
            </div>
        </>
    );
}

export default GameUI;
