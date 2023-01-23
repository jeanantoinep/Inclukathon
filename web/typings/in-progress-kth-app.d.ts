import {CompanyDto} from '../../server/src/company/dto/company.dto';
import {TeamDto} from '../../server/src/team/dto/team.dto';
import {LaunchIncluscoreDto} from '../../server/src/incluscore/dto/launch.incluscore.dto';
import {InclukathonDto} from '../../server/src/inclukathon-program/models/dto/inclukathon.dto';

interface InProgressKthWrapperProps extends IRouterProps {
	inclukathon?: InclukathonDto;
	company?: CompanyDto;
	currentTeam?: TeamDto;
	launch?: LaunchIncluscoreDto;
}
