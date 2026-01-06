import WebTorrent from 'webtorrent';

// Single persistent WebTorrent client instance
const client = new WebTorrent();

// Track active torrents: infoHash -> torrent instance
const activeTorrents = new Map();

// Enhanced logging for client events
client.on('error', (err) => {
    console.error('WebTorrent client error:', err);
});

/**
 * Seed a file and track the torrent
 * @param {string} filePath - Path to the file to seed
 * @returns {Promise<{magnetURI: string, infoHash: string, torrent: object}>}
 */
function seedFile(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const torrent = client.seed(filePath, (t) => {
                // Store in active torrents map
                activeTorrents.set(t.infoHash, t);

                console.log(`✅ Seeding started: ${t.name}`);
                console.log(`   InfoHash: ${t.infoHash}`);
                console.log(`   Magnet URI: ${t.magnetURI}`);

                // Resolve when seeding is ready
                resolve({
                    magnetURI: t.magnetURI,
                    infoHash: t.infoHash,
                    torrent: t
                });
            });

            // Enhanced event logging
            torrent.on('error', (err) => {
                console.error(`❌ Torrent error for ${torrent.name}:`, err);
                reject(err);
            });

            torrent.on('wire', (wire, addr) => {
                console.log(`🔗 Peer connected to ${torrent.name}: ${addr}`);
            });

            torrent.on('upload', (bytes) => {
                // Log upload progress periodically (every 1MB)
                if (torrent.uploaded % (1024 * 1024) < bytes) {
                    console.log(`⬆️  Uploaded ${(torrent.uploaded / 1024 / 1024).toFixed(2)} MB for ${torrent.name} (${torrent.numPeers} peers)`);
                }
            });

        } catch (err) {
            console.error('Error seeding file:', err);
            reject(err);
        }
    });
}

/**
 * Check if a file is currently being seeded
 * @param {string} infoHash - InfoHash of the torrent
 * @returns {boolean}
 */
function isSeeding(infoHash) {
    return activeTorrents.has(infoHash);
}

/**
 * Get torrent instance by infoHash
 * @param {string} infoHash - InfoHash of the torrent
 * @returns {object|null}
 */
function getTorrent(infoHash) {
    return activeTorrents.get(infoHash) || null;
}

/**
 * Stop seeding a specific torrent
 * @param {string} infoHash - InfoHash of the torrent to stop
 */
function stopSeeding(infoHash) {
    const torrent = activeTorrents.get(infoHash);
    if (torrent) {
        torrent.destroy(() => {
            activeTorrents.delete(infoHash);
            console.log(`🛑 Stopped seeding: ${torrent.name}`);
        });
    }
}

/**
 * Get client statistics
 * @returns {object}
 */
function getClientStats() {
    const torrents = Array.from(activeTorrents.values());
    return {
        activeTorrents: activeTorrents.size,
        totalPeers: torrents.reduce((sum, t) => sum + t.numPeers, 0),
        totalUploaded: torrents.reduce((sum, t) => sum + t.uploaded, 0),
        uploadSpeed: torrents.reduce((sum, t) => sum + t.uploadSpeed, 0),
        torrents: torrents.map(t => ({
            name: t.name,
            infoHash: t.infoHash,
            peers: t.numPeers,
            uploaded: t.uploaded,
            uploadSpeed: t.uploadSpeed,
            progress: t.progress,
            // List of connected peers with details
            connectedPeers: t.wires ? t.wires.map(wire => ({
                address: wire.remoteAddress,
                port: wire.remotePort,
                downloaded: wire.downloaded,
                uploaded: wire.uploaded,
                downloadSpeed: wire.downloadSpeed(),
                uploadSpeed: wire.uploadSpeed(),
                type: wire.type || 'unknown'
            })) : []
        }))
    };
}

/**
 * Gracefully destroy all torrents and close client
 */
function shutdown() {
    return new Promise((resolve) => {
        console.log('🛑 Shutting down WebTorrent client...');
        client.destroy(() => {
            activeTorrents.clear();
            console.log('✅ WebTorrent client shut down successfully');
            resolve();
        });
    });
}

export {
    seedFile,
    isSeeding,
    getTorrent,
    stopSeeding,
    getClientStats,
    shutdown,
    client
};