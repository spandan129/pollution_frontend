

const CustomToast = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <span className="mr-2">⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default CustomToast;