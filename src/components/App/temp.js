
{/* Grid Starts Here */}
<Grid container spacing={3}>
  {/* Left Side (logo, menu items) */}
  <Grid item container spacing={3} xs={2} style={{alignItems: 'center'}}> {/* TODO: Since all grids have it, maybe add alignItems as a theme or a style */}
    {/* Logo */}
    <Grid item xs={1} >
      <Link to={ROUTES.LANDING} className={ classes?.link ?? thisclasses.link }>
        <Avatar className={ classes?.albumicon ?? thisclasses.albumicon }>
          <AlbumIcon fontSize='small' />
        </Avatar>
      </Link>
    </Grid>
  </Grid>

  {/* Middle (Menu Items) */}
  <Grid item container spacing={3} xs={8} style={{alignItems: 'center'}}>
    <Hidden xsDown>
      <Grid item>
        <Typography variant='h6'>
          <Link to={ROUTES.SIGN_IN} className={ classes?.link ?? thisclasses.link }>Sign In</Link>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='h6'>
          <Link to={ROUTES.SIGN_IN} className={ classes?.link ?? thisclasses.link }>Sign In</Link>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='h6'>
          <Link to={ROUTES.SIGN_IN} className={ classes?.link ?? thisclasses.link }>Sign In</Link>
        </Typography>
      </Grid>
    </Hidden>
  </Grid>

  {/* Right Side (Account Items, Cart) */}
  <Grid item container spacing={3} xs={2} style={{alignItems: 'center'}} wrap='nowrap'>
    {/* Show on smdown */}
    <Hidden smUp>
      {/* Cart */}
      <Grid item style={{justifyContent: 'center'}}>
        <p style={{color: 'black'}}>Cart</p>
      </Grid>
      {/* Hamburger */}
      <Grid item style={{justifyContent: 'center'}}>
        <p style={{color: 'black'}}>Burger</p>
      </Grid>
    </Hidden>

    {/* Show on mdup */}
    <Hidden xsDown>
      {/* TODO: When logged in, account goes aboev this (and xs of other 2 items must change) */}
      {/* Login -> Form Dialogue, Responsive full-screen, transitions? */} 
      <Grid item style={{justifyContent: 'center', paddingRight: '4px'}}>
        <SignInPage />
      </Grid>
      {/* Cart Icon -> Menu (max height incase too many items4) */}
      <Grid item style={{justifyContent: 'center'}}>
        <p style={{color: 'black'}}>Cart</p>
      </Grid>
    </Hidden>

    {/* {matches.downsm 
      ? <React.Fragment>
        </React.Fragment>

      : <React.Fragment>
        </React.Fragment>
    } */}
  </Grid>
</Grid>