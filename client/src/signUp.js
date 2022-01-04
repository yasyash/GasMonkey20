/*
 * Copyright © 2018-2020 Yaroslav Shkliar <mail@ilit.ru>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Research Laboratory of IT
 * www.ilit.ru on e-mail: mail@ilit.ru
 * Also you сould open support domain www.cleenair.ru or write to e-mail: mail@cleenair.ru
 */
import React from 'react';
import PropTypes from 'prop-types';

import SignupForm from './signupForm';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
//import { connect } from 'net';
import { connect } from 'react-redux';
import { userSignupRequest, isUserExists } from './actions/signupActions';
import { applyMiddleware } from 'redux';
import { addFlashMessage } from './actions/flashMessages';

class signUp extends React.Component {

    render() {
        const { userSignupRequest, addFlashMessage, isUserExists } = this.props;
        //const {store} = this.store;
        return (
            <div className="container">

                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <SignupForm userSignupRequest={userSignupRequest}
                            addFlashMessage={addFlashMessage}
                            isUserExists={isUserExists} />
                    </div>

                </div>
            </div>

        );
    }
}

signUp.propTypes = {
    userSignupRequest: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    isUserExists: PropTypes.func.isRequired

}



//export default connect((state) => {return {}}, {userSignupRequest})(signUp);
export default connect((state) => { return {} }, { userSignupRequest, addFlashMessage, isUserExists })(signUp);