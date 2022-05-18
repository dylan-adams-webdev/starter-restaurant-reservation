import { Link } from 'react-router-dom';

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
	return (
		<nav className='navbar navbar-light bg-light fixed-top navbar-expand-lg'>
			<div className='container'>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='offcanvas'
					data-bs-target='#offcanvasNavbar'
					aria-controls='offcanvasNavbar'>
					<span className='navbar-toggler-icon'></span>
				</button>
				<Link className='navbar-brand' to='/'>
					Periodic Tables
				</Link>
				{/* OFFCANVAS START */}
				<div
					className='offcanvas offcanvas-start'
					tabIndex='-1'
					id='offcanvasNavbar'
					aria-labelledby='offcanvasNavbarLabel'>
					<div className='offcanvas-header'>
						<h5
							className='offcanvas-title'
							id='offcanvasNavbarLabel'>
							Periodic Tables
						</h5>
						<button
							type='button'
							className='btn-close text-reset'
							data-bs-dismiss='offcanvas'
							aria-label='Close'></button>
					</div>
					<div className='offcanvas-body'>
						<ul className='navbar-nav justify-content-end flex-grow-1 pe-3'>
							<li id='dashboard' className='nav-item'>
								<Link className='nav-link' to='/dashboard'>
									<span className='oi oi-dashboard'></span>
									&nbsp;Dashboard
								</Link>
							</li>
							<li id='search' className='nav-item'>
								<Link className='nav-link' to='/search'>
									<span className='oi oi-magnifying-glass'></span>
									&nbsp;Search
								</Link>
							</li>
							<li id='new-reservation' className='nav-item'>
								<Link
									className='nav-link'
									to='/reservations/new'>
									<span className='oi oi-plus'></span>
									&nbsp;New Reservation
								</Link>
							</li>
							<li>
								<Link
									id='new-table'
									className='nav-link'
									to='/tables/new'>
									<span className='oi oi-layers'></span>
									&nbsp;New Table
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Menu;
