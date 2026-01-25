import LoadingSpinner from "./LoadingSpinner";

export default function LoadingScreen() {
    return (
        <div className="w-full h-full flex justify-center items-center bg-white">
            <LoadingSpinner />
        </div>
    );
}