from fastapi import HTTPException, status

# Base
DataConflictException = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail={'msg': 'Data conflict'}
)

# Database exceptions.
UniqueViolationException = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail={'msg': 'Unique violation error'}
)

ForeignKeyViolationException = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail={'msg': 'ForeignKey violation error'}
)

IntegrityException = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail={'msg': 'Integrity error'}
)

InvalidRequestException = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail={'msg': 'Invalid request error'}
)

DatabaseException = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail={'msg': 'Database error'}
)

DatabaseDataTypeException = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail={'msg': 'Database data type error'}
)

MultipleResultsFoundException = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail={'msg': 'Multiple results found'}
)

# Dashboard
ProjectNotFoundException = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail={'msg': 'Project not found'}
)

# Task
CreateForbiddenTaskException = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail={'msg', 'Create task forbidden'}
)
