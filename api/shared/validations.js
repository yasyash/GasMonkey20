/*
 * Copyright © 2018 Yaroslav Shkliar <mail@ilit.ru>
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

import Validator from 'validator';
import isEmpty from 'lodash.isempty';



export default function commonValidations(data) {
    let errors = {};

if ((data.email==''))
{
    errors.email = 'Это поле обязательно';
}

if (!Validator.isEmail(data.email))
{
    errors.email = 'Формат email не верен.';
}

if ((data.username ==''))
{
    errors.username = 'Это поле обязательно';
}

if ((data.passwrd) =='')
{
    errors.passwrd = 'Это поле обязательно';
}

if ((data.confirm_passwrd ==''))
{
    errors.confirm_passwrd = 'Это поле обязательно';
}

if (!Validator.equals( data.passwrd, data.confirm_passwrd))
{
    errors.confirm_passwrd = 'Пароли не совпадают';
}

if ((data.mobile ==''))
{
    errors.mobile = 'Это поле обязательно';
}

    return {
        errors,
        isValid: isEmpty(errors)
    }
}