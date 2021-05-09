import { Box, Flex, SlideFade, useBreakpointValue } from '@chakra-ui/react';

import styles from './LayoutContainer.module.scss';

import Nav from '../nav';

const LayoutContainer = ({ children }) => {
	return (
		<>
			<Nav />
			<SlideFade in>
				<Flex justifyContent="center">
					<Box
						className={styles.root}
						minHeight={useBreakpointValue({
							base: 'calc(100vh - 186px)',
							lg: 'calc(100vh - 140px)',
						})}
						mt="1rem"
						width="900px"
						maxWidth={useBreakpointValue({
							base: '95%',
							lg: '900px',
						})}
					>
						{children}
					</Box>
				</Flex>
			</SlideFade>
		</>
	);
};

export default LayoutContainer;
