import {FunctionComponent} from "react";
import {LucideIcon} from "lucide-react";

type TMissCandleValuePropProps = {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
}

const MissCandleValueProp: FunctionComponent<TMissCandleValuePropProps> = ({ icon, title, description }) => {
  return (
    // <></>
    <div className="flex flex-col items-center md:flex-col md:items-center gap-4 group">
      {/* Icon Wrapper */}
      <div className="w-12 h-12 rounded-[50px] border border-primary text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>

      {/* Text Content */}
      <div className="text-center md:text-center">
        <h4 className="text-dark font-medium text-base">
          {title}
        </h4>
        <p className="text-dark/80 text-xs md:text-sm mt-1 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MissCandleValueProp;
