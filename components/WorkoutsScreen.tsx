
import React, { useState, useEffect } from 'react';
import { WORKOUT_CATEGORIES, YOUTUBE_VIDEOS } from '../constants';
import { Workout } from '../types';
import { PlayIcon, ClockIcon } from './Icons';

interface WorkoutPlayerProps {
    video: Workout;
    onClose: () => void;
}

const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ video, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{video.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
            </div>
        </div>
    );
};

interface WorkoutsScreenProps {
    initialCategory?: string | null;
}

const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({ initialCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Daily Routine');
    const [playingVideo, setPlayingVideo] = useState<Workout | null>(null);

    useEffect(() => {
        if(initialCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    const filteredWorkouts = YOUTUBE_VIDEOS.filter(w => w.category === selectedCategory);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Workouts</h1>
            <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
                {WORKOUT_CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-semibold transition whitespace-nowrap ${selectedCategory === category ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredWorkouts.map(workout => (
                    <div key={workout.id} className="bg-gray-800 rounded-lg overflow-hidden flex" onClick={() => setPlayingVideo(workout)}>
                        <div className="relative w-2/5">
                             <img src={`https://img.youtube.com/vi/${workout.videoId}/mqdefault.jpg`} alt={workout.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                 <PlayIcon className="w-8 h-8 text-white"/>
                             </div>
                        </div>
                        <div className="p-4 w-3/5">
                            <h3 className="font-bold text-md text-white">{workout.title}</h3>
                            <p className="text-sm text-gray-400 flex items-center mt-2">
                                <ClockIcon className="w-4 h-4 mr-1"/>
                                {workout.duration}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {playingVideo && <WorkoutPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}
        </div>
    );
};

export default WorkoutsScreen;
