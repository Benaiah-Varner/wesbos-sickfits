import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import styled from 'styled-components';
import RequestReset from '../components/RequestReset';

const GridStyles = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 2rem;
`;

export const SignInPage = () => {
    return (
        <GridStyles>
            <SignIn></SignIn>
            <SignUp></SignUp>
            <RequestReset></RequestReset>
        </GridStyles>
    )
}

export default SignInPage
