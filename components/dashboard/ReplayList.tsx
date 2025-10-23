import React, { useEffect, useState } from 'react';
import { Download, Trash2, FileVideo, Search, RefreshCw } from 'lucide-react';
import { Replay } from '@/lib/types';
import { replaysAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

export const ReplayList: React.FC = () => {
  const { data: session } = useSession();
  const [replays, setReplays] = useState<Replay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  const fetchReplays = async () => {
    try {
      setLoading(true);
      const data = await replaysAPI.getAll(100, 0);
      setReplays(data.replays);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch replays:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplays();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this replay?')) {
      return;
    }

    try {
      await replaysAPI.delete(id, session);
      setReplays((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => prev - 1);
    } catch (error) {
      console.error('Failed to delete replay:', error);
      alert('Failed to delete replay. You may not have permission.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredReplays = replays.filter((replay) =>
    replay.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    replay.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    replay.gameMode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileVideo className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">
            Replays ({total})
          </h2>
        </div>
        <button
          onClick={fetchReplays}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search replays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">File Name</th>
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">User</th>
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">Game Mode</th>
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">Size</th>
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">Uploaded</th>
              <th className="pb-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Loading replays...
                </td>
              </tr>
            ) : filteredReplays.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No replays found
                </td>
              </tr>
            ) : (
              filteredReplays.map((replay) => (
                <tr
                  key={replay.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium truncate max-w-xs">
                        {replay.fileName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {replay.userAvatar && (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${replay.userId}/${replay.userAvatar}.png?size=32`}
                          alt={replay.username}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-gray-300 text-sm">{replay.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 text-sm">{replay.gameMode}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 text-sm">{formatBytes(replay.fileSize)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(replay.createdAt), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={replaysAPI.download(replay.id)}
                        className="p-2 bg-blue-600/10 text-blue-400 rounded hover:bg-blue-600/20 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(replay.id)}
                        className="p-2 bg-red-600/10 text-red-400 rounded hover:bg-red-600/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReplayList;

