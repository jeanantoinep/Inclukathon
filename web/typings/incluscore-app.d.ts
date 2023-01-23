import {IncluscoreDto} from '../../server/src/incluscore/dto/incluscore.dto';
import {CompanyDto} from '../../server/src/company/dto/company.dto';
import {TeamDto} from '../../server/src/team/dto/team.dto';
import {LaunchIncluscoreDto} from '../../server/src/incluscore/dto/launch.incluscore.dto';

interface IncluscoreWrappedComponentProps extends IRouterProps {
	incluscore: IncluscoreDto;
	company?: CompanyDto;
	companyImgPath?: string;
	launch: LaunchIncluscoreDto;
	incluscoreAppGoTo?: (pathname: string, additionalSearch?: string, refresh?: boolean) => any;
}
