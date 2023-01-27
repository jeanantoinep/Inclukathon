import { IncluscoreDto } from "../../server/src/incluscore/dto/incluscore.dto";
import { CompanyDto } from "../../server/src/company/dto/company.dto";
import { ThemeDto } from "../../server/src/incluscore/dto/theme.dto";
import { LaunchIncluscoreDto } from "../../server/src/incluscore/dto/launch.incluscore.dto";
import { SingleThemeStat } from "server/src/incluscore/progression/launch.incluscore.stats.service";

interface IncluscoreWrappedComponentProps extends IRouterProps {
  incluscore: IncluscoreDto;
  company?: CompanyDto;
  companyImgPath?: string;
  launch: LaunchIncluscoreDto;
  launchScr?: LaunchIncluscoreDto;
  launchStats: any;
  totalUsers: number;
  stat: SingleThemeStat;
  selectedTheme?: ThemeDto;
  incluscoreAppGoTo?: (
    pathname: string,
    additionalSearch?: string,
    refresh?: boolean
  ) => any;
}
