
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserTypeCardProps {
  userType: 'admin' | 'coach' | 'parent';
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const UserTypeCard = ({ userType, title, description, icon, href }: UserTypeCardProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(href);
  }, [navigate, href]);

  const getCircleStyles = () => {
    switch (userType) {
      case 'admin':
        return 'bg-gradient-to-br from-red-100 to-red-200 border-red-300 hover:from-red-200 hover:to-red-300 hover:border-red-400 hover:shadow-red-200';
      case 'coach':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 hover:from-blue-200 hover:to-blue-300 hover:border-blue-400 hover:shadow-blue-200';
      case 'parent':
        return 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 hover:from-green-200 hover:to-green-300 hover:border-green-400 hover:shadow-green-200';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 font-roboto">
      <div 
        className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-xl ${getCircleStyles()}`}
        onClick={handleClick}
      >
        {icon}
      </div>
      <p className="text-base md:text-lg font-semibold text-gray-800 uppercase">{title}</p>
    </div>
  );
};

export default UserTypeCard;
