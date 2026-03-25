import styles from './index.module.scss';
import { clsx } from 'clsx';

interface ButtonProps {
  customBg?: string;
  className?: string;
  children: React.ReactNode;
  fullName: string;
  objName: {
    firstName: string;
    lastName: string;
  };
  handleSetFirstName: () => void;
}

const Button: React.FC<ButtonProps> = ({ customBg, className, children, fullName, objName, handleSetFirstName }) => {
  console.log('render Button');
  return (
    <div className={clsx(styles.buttonGroup, className)}>
      <span>{fullName}</span>
      <span>{objName.firstName} {objName.lastName}</span>
      <button className="button1" onClick={handleSetFirstName}>
        {children}
      </button>
      <button className="button2">
        {children}
      </button>
    </div>
  );
};

export default Button;