const Alert = ({ type = 'error', message }) => {
    const bg = type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200';
    return (
        <div className={`p-4 mb-4 rounded border ${bg}`}>
            {message}
        </div>
    );
};

export default Alert;
