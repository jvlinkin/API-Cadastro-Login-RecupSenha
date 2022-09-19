# API-Login

https://api-login-cadastro-recup-senha.onrender.com

### API criada com o intuito de simular um ambiente de login de um sistema, incluindo o fluxo de recuperação de senha.

## Métodos
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com/) | Verifica se a API está de pé. |
| `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/register| Utiliza para criar um usuário na aplicação. |
| `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/login| Utiliza para usuário se autenticar na aplicação. |
| `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/forgot-password| Utiliza para usuário receber email de troca de senha. |
| `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/reset-password| Utiliza para usuário inserir nova senha. |

## Corpo das requisiões
### `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/register

+ Request (application/json)

    + Body

            {
	            "first_name": "Paula",
	            "last_name": "Lima",
	            "age": 32,
	            "address": "Frascinsco Deleveiga",
	            "number": "1251",
	            "zip_code": "855223412",
	            "city": "Curitiba",
	            "cellphone": "41-88521241",
	            "email": "paulalima@gmail.com",
	            "password": "paulalima"
            }
            
### `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/login

+ Request (application/json)

    + Body
    
            {
	            "email": "seuemail@seuemail.com",
	            "password": "suasenha"	            
            }
            

### `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/forgot-password

+ Request (application/json)

    + Body
    
            {
	            "email": "seuemail@seuemail.com"	            
            }
            

### `POST` - [Endereço da API](https://api-login-cadastro-recup-senha.onrender.com)/user/reset-password

+ Request (application/json)

    + Body
    
            {
	          "email": "seuemail@seuemail.com",
              "token": "dçoskofkl8556987894645djifiosjfksjf",
              "password": "novasenha"
            }



Tecnologias usadas:

* **Node.js**
* **npm/yarn**
* **Typescript**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Bcrypt**
* **Json Web Token (JWT)**
* **Nodemailer (SMTP)**
