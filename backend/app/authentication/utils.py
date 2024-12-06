from datetime import datetime, timedelta

import jwt


def token_encode(el_id: int, secret: str):
    token = jwt.encode({
        'id': el_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, secret, algorithm='HS256')

    return token


def token_decode(token, secret):
    try:
        token = jwt.decode(token, secret, algorithms='HS256')
        answer_decode = {'status': 200, 'token': [token, ]}
    except jwt.ExpiredSignatureError:
        answer_decode = {'status': 401, 'message': 'Token expired.'}
    except Exception as e:
        answer_decode = {'status': 401, 'message': 'Invalid token.'}
    return answer_decode
