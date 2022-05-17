import React from 'react';

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

				<div
					className='offcanvas offcanvas-start'
					tabindex='-1'
					id='offcanvasNavbar'
					aria-labelledby='offcanvasNavbarLabel'>
					<div className='offcanvas-header'>
						<h5
							className='offcanvas-title'
							id='offcanvasNavbarLabel'>
							Offcanvas
						</h5>
						<button
							type='button'
							className='btn-close text-reset'
							data-bs-dismiss='offcanvas'
							aria-label='Close'></button>
					</div>
					<div className='offcanvas-body'>
						<ul className='navbar-nav justify-content-end flex-grow-1 pe-3'>
							<li className='nav-item'>
								<Link className='nav-link active' to='/'>
									Home
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>

		// <nav className="navbar navbar-dark align-items-start p-0">
		//   <div className="container-fluid d-flex flex-column p-0">
		//     <Link
		//       className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
		//       to="/"
		//     >
		//       <div className="sidebar-brand-text mx-3">
		//         <span>Periodic Tables</span>
		//       </div>
		//     </Link>
		//     <hr className="sidebar-divider my-0" />
		//     <ul className="nav navbar-nav text-light" id="accordionSidebar">
		//       <li className="nav-item">
		//         <Link className="nav-link" to="/dashboard">
		//           <span className="oi oi-dashboard" />
		//           &nbsp;Dashboard
		//         </Link>
		//       </li>
		//       <li className="nav-item">
		//         <Link className="nav-link" to="/search">
		//           <span className="oi oi-magnifying-glass" />
		//           &nbsp;Search
		//         </Link>
		//       </li>
		//       <li className="nav-item">
		//         <Link className="nav-link" to="/reservations/new">
		//           <span className="oi oi-plus" />
		//           &nbsp;New Reservation
		//         </Link>
		//       </li>
		//       <li className="nav-item">
		//         <Link className="nav-link" to="/tables/new">
		//           <span className="oi oi-layers" />
		//           &nbsp;New Table
		//         </Link>
		//       </li>
		//     </ul>
		//     <div className="text-center d-none d-md-inline">
		//       <button
		//         className="btn rounded-circle border-0"
		//         id="sidebarToggle"
		//         type="button"
		//       />
		//     </div>
		//   </div>
		// </nav>
	);
}

export default Menu;
