"use client";

import { useState, useEffect, useRef } from "react";
import { recordEngagement } from "@/lib/engagement";

export default function ClientEngagement({
    albumId,
    initialViewCount,
    initialLikeCount
}: {
    albumId: number;
    initialViewCount: number;
    initialLikeCount: number;
}) {
    const [viewCount, setViewCount] = useState(initialViewCount);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(false);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const viewRecorded = useRef(false);

    // Initial check for liked state in localStorage
    useEffect(() => {
        try {
            const likedAlbums = JSON.parse(localStorage.getItem('sbh_liked_albums') || '{}');
            if (likedAlbums[albumId]) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsLiked(true);
            }
        } catch { }
    }, [albumId]);

    // Record view (once per page load per album)
    useEffect(() => {
        if (viewRecorded.current) return;
        viewRecorded.current = true;

        recordEngagement(albumId, 'view').then(result => {
            if (result.success && result.view_count !== undefined) {
                setViewCount(result.view_count);
                if (result.like_count !== undefined) setLikeCount(result.like_count);
            }
        });
    }, [albumId]);

    const handleLike = async () => {
        if (isLiked) return;

        setLikeAnimating(true);
        setIsLiked(true);
        setLikeCount(prev => prev + 1); // Optimistic update

        const result = await recordEngagement(albumId, 'like');

        if (result.success) {
            if (result.like_count !== undefined) setLikeCount(result.like_count);
            if (result.view_count !== undefined) setViewCount(result.view_count);

            // Persist liked state
            try {
                const likedAlbums = JSON.parse(localStorage.getItem('sbh_liked_albums') || '{}');
                likedAlbums[albumId] = true;
                localStorage.setItem('sbh_liked_albums', JSON.stringify(likedAlbums));
            } catch { }
        } else {
            // Revert optimistic update on failure
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        }

        setTimeout(() => setLikeAnimating(false), 600);
    };

    return (
        <>
            {/* Divider if shown alongside date */}
            <span className="hidden md:inline text-zinc-700">•</span>
            
            <div className="flex items-center gap-6">
                {/* View count */}
                <span className="flex items-center gap-1.5 text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {viewCount}
                </span>

                {/* Like button */}
                <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center gap-1.5 transition-all duration-300 ${
                        isLiked
                            ? "text-[#a78bfa]"
                            : "text-zinc-500 hover:text-[#a78bfa]"
                    } ${likeAnimating ? "scale-125" : "scale-100"} ${!isLiked ? "cursor-pointer" : "cursor-default"}`}
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-all duration-300 ${likeAnimating ? "scale-125" : ""}`}
                        fill={isLiked ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {likeCount}
                </button>
            </div>
        </>
    );
}
