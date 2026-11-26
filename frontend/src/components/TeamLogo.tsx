import { teamLogos } from "../utils/teamLogos";

interface TeamLogoProps {
    team: string;
}

export function TeamLogo({ team }: TeamLogoProps) {
    const logo = teamLogos[team];

    if (!logo) {
        return null;
    }

    return (
        <img
            src={logo}
            alt=""
            className="team-logo"
        />
    );
}